/**
 * Redline Win-Back Engine — segmentation & sequencing logic.
 *
 * This is a client-side port of the real Python (FastAPI) service. Same
 * suppression order, same interval math, same scoring weights, same tier
 * cutoffs, same sequence tables, same seeded holdout assignment — just
 * running in the browser instead of behind a POST /segment webhook. Pure
 * functions only; nothing here touches the network or storage.
 */

var ENGINE = (function () {
  'use strict';

  var SEQUENCES = {
    HOT: [
      { day: 1, channel: 'email', stop_if_booked: true },
      { day: 3, channel: 'sms', stop_if_booked: true },
      { day: 7, channel: 'voice', stop_if_booked: true }
    ],
    WARM: [
      { day: 1, channel: 'email', stop_if_booked: true },
      { day: 5, channel: 'sms', stop_if_booked: true }
    ],
    COLD: [
      { day: 1, channel: 'email', stop_if_booked: true }
    ]
  };

  function defaultConfig() {
    return {
      studioType: 'boutique',           // 'boutique' | 'general' — drives the single-visit default interval
      defaultIntervalDays: { boutique: 10, general: 21 },
      caslEnabled: true,                // whether the 24-month implied-consent check applies at all
      consentExpiryMonths: 24,
      holdoutPercent: 12,
      seed: 2,
      hotMinScore: 70,
      warmMinScore: 40
    };
  }

  // ---------------------------------------------------------------------
  // Date helpers
  // ---------------------------------------------------------------------

  function parseISO(iso) {
    var p = iso.split('-').map(Number);
    return Date.UTC(p[0], p[1] - 1, p[2]);
  }

  function daysBetween(isoA, isoB) {
    return Math.round((parseISO(isoB) - parseISO(isoA)) / 86400000);
  }

  function monthsBetween(isoA, isoB) {
    return (parseISO(isoB) - parseISO(isoA)) / 86400000 / 30.44;
  }

  function sortedVisits(visitHistory) {
    return visitHistory.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  }

  // ---------------------------------------------------------------------
  // Step 1 — suppression filter (runs before any scoring)
  // Priority order matches the spec's listed order; first match wins.
  // ---------------------------------------------------------------------

  function suppressionReason(client, config, today) {
    if (client.has_future_booking) return 'has_future_booking';
    if (client.opted_out) return 'opted_out';
    if (client.email_hard_bounced) return 'email_hard_bounced';
    if (client.membership_status === 'active') return 'active_member';
    if (config.caslEnabled && monthsBetween(client.consent_date, today) > config.consentExpiryMonths) {
      return 'needs_express_consent';
    }
    return null;
  }

  // ---------------------------------------------------------------------
  // Step 2 — expected return interval + lapsed determination
  // ---------------------------------------------------------------------

  function expectedIntervalDays(client, config) {
    var visits = sortedVisits(client.visit_history);
    if (visits.length >= 2) {
      var gaps = [];
      for (var i = 1; i < visits.length; i++) gaps.push(daysBetween(visits[i - 1].date, visits[i].date));
      var sum = gaps.reduce(function (a, b) { return a + b; }, 0);
      return sum / gaps.length;
    }
    return config.defaultIntervalDays[config.studioType];
  }

  function lastVisitDate(client) {
    var visits = sortedVisits(client.visit_history);
    return visits[visits.length - 1].date;
  }

  function isLapsed(client, expectedInterval, daysSince) {
    if (client.membership_status === 'cancelled') return true; // always lapsed, regardless of interval
    return daysSince > 2 * expectedInterval;
  }

  // ---------------------------------------------------------------------
  // Step 3 — score (0-100) and tier
  // Weighted: frequency/consistency primary (65), recency-past-threshold
  // secondary (15), lifetime spend last (20).
  // ---------------------------------------------------------------------

  function lifetimeSpend(client) {
    return client.visit_history.reduce(function (s, v) { return s + (v.amount || 0); }, 0);
  }

  function scoreClient(client, expectedInterval, daysSince) {
    var visitsPerWeek = expectedInterval > 0 ? 7 / expectedInterval : 0;
    var freqScore = clamp(Math.round((visitsPerWeek / 2.5) * 65), 0, 65);

    var ratio = expectedInterval > 0 ? daysSince / expectedInterval : 0;
    var recencyScore = clamp(Math.round(15 - (ratio - 2) * 3), 3, 15);

    var spend = lifetimeSpend(client);
    var spendScore = clamp(Math.round((spend / 600) * 20), 0, 20);

    var total = clamp(freqScore + recencyScore + spendScore, 0, 100);
    return { total: total, freqScore: freqScore, recencyScore: recencyScore, spendScore: spendScore, visitsPerWeek: visitsPerWeek };
  }

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  function tierForScore(score, config) {
    if (score >= config.hotMinScore) return 'HOT';
    if (score >= config.warmMinScore) return 'WARM';
    return 'COLD';
  }

  // ---------------------------------------------------------------------
  // Step 5 — seeded holdout assignment (12% per tier by default)
  // mulberry32: small, fast, deterministic PRNG so the same seed always
  // produces the same holdout group.
  // ---------------------------------------------------------------------

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seedFromString(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = (Math.imul(31, h) + str.charCodeAt(i)) | 0; }
    return h >>> 0;
  }

  // Each lapsed, sequenced client independently draws against the holdout
  // rate — a fair reading of "randomly assign X% of each tier" that stays
  // meaningful at small tier sizes (a fixed-count top-N pick rounds to zero
  // whenever a tier has fewer than ~5 members, which silently hides the
  // feature on any modest export). Draw order is sorted by client_id so the
  // outcome for a given seed never depends on upstream sort/filter order.
  function assignHoldout(results, config) {
    var pct = config.holdoutPercent / 100;
    var tiers = ['HOT', 'WARM', 'COLD'];
    tiers.forEach(function (tier) {
      var group = results.filter(function (r) { return r.tier === tier; })
        .sort(function (a, b) { return a.client_id < b.client_id ? -1 : 1; });
      if (group.length === 0) return;
      var rng = mulberry32((config.seed >>> 0) ^ seedFromString(tier));
      group.forEach(function (r) { r.holdout = rng() < pct; });
    });
  }

  // ---------------------------------------------------------------------
  // Full pipeline
  // ---------------------------------------------------------------------

  function runSegmentation(clients, config, today) {
    today = today || DEMO_TODAY;
    var results = clients.map(function (client) {
      var expectedInterval = expectedIntervalDays(client, config);
      var lastVisit = lastVisitDate(client);
      var daysSince = daysBetween(lastVisit, today);
      var suppressed = suppressionReason(client, config, today);
      var lapsedFlag = isLapsed(client, expectedInterval, daysSince);
      var scoreInfo = scoreClient(client, expectedInterval, daysSince);

      var atRisk = false;
      if (suppressed === 'active_member') {
        atRisk = daysSince > 1.5 * expectedInterval;
      }

      var eligibleForSequence = !suppressed && lapsedFlag;
      var tier = null, sequence = [], score = 0;

      if (eligibleForSequence) {
        tier = tierForScore(scoreInfo.total, config);
        sequence = SEQUENCES[tier];
        score = scoreInfo.total;
      } else if (suppressed === 'needs_express_consent' && lapsedFlag) {
        // Not dropped silently — still scored/tiered for when consent is renewed, just not sequenced yet.
        tier = tierForScore(scoreInfo.total, config);
        score = scoreInfo.total;
      }

      return {
        // ---- exact API output contract ----
        client_id: client.client_id,
        lapsed: lapsedFlag,
        tier: tier,
        score: score,
        expected_interval_days: Math.round(expectedInterval * 10) / 10,
        days_since_last_visit: daysSince,
        membership_status: client.membership_status,
        sequence: sequence,
        holdout: false, // finalized by assignHoldout() below
        suppressed_reason: suppressed,
        // ---- demo-only extras (not part of the API contract) ----
        _name: client.name,
        _email: client.email,
        _phone: client.phone,
        _at_risk: atRisk,
        _score_breakdown: scoreInfo,
        _visit_count: client.visit_history.length,
        _lifetime_spend: lifetimeSpend(client),
        _last_visit_date: lastVisit,
        _note: client._demo_note
      };
    });

    assignHoldout(results, config);
    return results;
  }

  // Strips the demo-only underscore-prefixed fields, returning exactly the
  // JSON contract shape the real webhook would respond with.
  function toContractShape(result) {
    return {
      client_id: result.client_id,
      lapsed: result.lapsed,
      tier: result.tier,
      score: result.score,
      expected_interval_days: result.expected_interval_days,
      days_since_last_visit: result.days_since_last_visit,
      membership_status: result.membership_status,
      sequence: result.sequence,
      holdout: result.holdout,
      suppressed_reason: result.suppressed_reason
    };
  }

  return {
    defaultConfig: defaultConfig,
    runSegmentation: runSegmentation,
    toContractShape: toContractShape,
    SEQUENCES: SEQUENCES
  };
})();
