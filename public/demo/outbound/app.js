(function () {
  'use strict';

  // Fully client-side. No fetch, no localStorage/sessionStorage/cookies —
  // a hard refresh (or Reset demo) returns to the exact seed state.

  var ICONS = {
    email: '<svg viewBox="0 0 20 20" fill="none"><rect x="2.5" y="4.5" width="15" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M3.5 5.5l6.5 5 6.5-5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sms: '<svg viewBox="0 0 20 20" fill="none"><path d="M3 4.5h14a1 1 0 011 1v7a1 1 0 01-1 1H8l-3.5 3v-3H3a1 1 0 01-1-1v-7a1 1 0 011-1z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    voice: '<svg viewBox="0 0 20 20" fill="none"><path d="M4 3.5c.6 0 1.7 0 2.3.1.5.1.9.5 1 1 .2.8.5 1.9.8 2.6.2.4.1.9-.2 1.2l-1 1c.8 1.7 2.1 3 3.8 3.8l1-1c.3-.3.8-.4 1.2-.2.7.3 1.8.6 2.6.8.5.1.9.5 1 1 .1.6.1 1.7.1 2.3 0 .6-.5 1-1 1-6.4 0-11.6-5.2-11.6-11.6 0-.5.4-1 1-1z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    chevron: '<svg viewBox="0 0 10 10" fill="none"><path d="M3 1l5 4-5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  var SUPPRESSION_LABEL = {
    has_future_booking: 'Already booked',
    opted_out: 'Opted out',
    email_hard_bounced: 'Email bounced',
    active_member: 'Active member',
    needs_express_consent: 'Needs re-consent'
  };

  var STATE = {
    config: ENGINE.defaultConfig(),
    results: [],
    expandedId: null
  };

  function clientById(id) {
    for (var i = 0; i < DEMO_CLIENTS.length; i++) if (DEMO_CLIENTS[i].client_id === id) return DEMO_CLIENTS[i];
    return null;
  }

  // ---------------------------------------------------------------------
  // Config form <-> state
  // ---------------------------------------------------------------------

  var el = {};
  function cacheEls() {
    ['cfg-studio-type', 'cfg-holdout', 'cfg-holdout-value', 'cfg-seed', 'cfg-casl', 'cfg-casl-label',
      'cfg-hot-min', 'cfg-hot-min-value', 'cfg-warm-min', 'cfg-warm-min-value',
      'btn-run', 'restart-demo', 'revenue-banner', 'summary-tiles', 'results-tbody',
      'result-cards', 'results-subtitle'
    ].forEach(function (id) { el[id] = document.getElementById(id); });
  }

  function applyConfigToForm(config) {
    document.getElementById('cfg-studio-type').value = config.studioType;
    document.getElementById('cfg-holdout').value = config.holdoutPercent;
    document.getElementById('cfg-holdout-value').textContent = config.holdoutPercent + '%';
    document.getElementById('cfg-seed').value = config.seed;
    document.getElementById('cfg-casl').checked = config.caslEnabled;
    document.getElementById('cfg-casl-label').textContent = config.caslEnabled ? 'Yes' : 'No';
    document.getElementById('cfg-hot-min').value = config.hotMinScore;
    document.getElementById('cfg-hot-min-value').textContent = config.hotMinScore;
    document.getElementById('cfg-warm-min').value = config.warmMinScore;
    document.getElementById('cfg-warm-min-value').textContent = config.warmMinScore;
  }

  function readConfigFromForm() {
    var base = ENGINE.defaultConfig();
    base.studioType = document.getElementById('cfg-studio-type').value;
    base.holdoutPercent = Number(document.getElementById('cfg-holdout').value);
    base.seed = Number(document.getElementById('cfg-seed').value) || 0;
    base.caslEnabled = document.getElementById('cfg-casl').checked;
    base.hotMinScore = Number(document.getElementById('cfg-hot-min').value);
    base.warmMinScore = Number(document.getElementById('cfg-warm-min').value);
    return base;
  }

  function bindLiveLabels() {
    document.getElementById('cfg-holdout').addEventListener('input', function (e) {
      document.getElementById('cfg-holdout-value').textContent = e.target.value + '%';
    });
    document.getElementById('cfg-hot-min').addEventListener('input', function (e) {
      document.getElementById('cfg-hot-min-value').textContent = e.target.value;
    });
    document.getElementById('cfg-warm-min').addEventListener('input', function (e) {
      document.getElementById('cfg-warm-min-value').textContent = e.target.value;
    });
    document.getElementById('cfg-casl').addEventListener('change', function (e) {
      document.getElementById('cfg-casl-label').textContent = e.target.checked ? 'Yes' : 'No';
    });
  }

  // ---------------------------------------------------------------------
  // Pipeline run
  // ---------------------------------------------------------------------

  function run() {
    var config = readConfigFromForm();
    STATE.config = config;
    STATE.results = ENGINE.runSegmentation(DEMO_CLIENTS, config, DEMO_TODAY);
    STATE.expandedId = null;
    renderAll();
  }

  // ---------------------------------------------------------------------
  // Rendering — summary tiles
  // ---------------------------------------------------------------------

  // A client's usual monthly value if they'd kept visiting at their own
  // historical pace — visits/month × their average spend per visit. This is
  // what's actually on the line for a lapsed client, not just a headcount.
  function estimatedMonthlyValue(r) {
    if (!r._visit_count) return 0;
    var avgPerVisit = r._lifetime_spend / r._visit_count;
    var visitsPerMonth = 30.44 / r.expected_interval_days;
    return avgPerVisit * visitsPerMonth;
  }

  function money(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  // Counts as revenue actually on the line: lapsed, and not already
  // accounted for (a future booking means they're already coming back; an
  // active member was never at risk in the first place).
  function isRevenueAtRisk(r) {
    return r.lapsed && r.suppressed_reason !== 'has_future_booking' && r.suppressed_reason !== 'active_member';
  }

  function renderSummary() {
    var results = STATE.results;
    var total = results.length;
    var suppressed = results.filter(function (r) { return r.suppressed_reason && r.suppressed_reason !== 'needs_express_consent'; }).length;
    var consentFlagged = results.filter(function (r) { return r.suppressed_reason === 'needs_express_consent'; }).length;
    var sequenced = results.filter(function (r) { return r.sequence.length > 0; }).length;
    var hot = results.filter(function (r) { return r.tier === 'HOT'; }).length;
    var warm = results.filter(function (r) { return r.tier === 'WARM'; }).length;
    var cold = results.filter(function (r) { return r.tier === 'COLD'; }).length;
    var holdout = results.filter(function (r) { return r.holdout; }).length;

    var atRiskRows = results.filter(isRevenueAtRisk);
    var revenueAtRisk = atRiskRows.reduce(function (sum, r) { return sum + estimatedMonthlyValue(r); }, 0);

    el['revenue-banner'].innerHTML =
      '<div class="revenue-banner__label">Estimated revenue at risk</div>' +
      '<div class="revenue-banner__value">' + money(revenueAtRisk) + '<span class="revenue-banner__unit">/mo</span></div>' +
      '<div class="revenue-banner__meta">Based on the usual monthly spend of ' + atRiskRows.length + ' lapsed clients</div>';

    var tiles = [
      { label: 'Clients reviewed', value: total, meta: 'from this sample export' },
      { label: 'Being re-engaged', value: sequenced, meta: hot + ' hot · ' + warm + ' warm · ' + cold + ' cold', cls: 'is-hot' },
      { label: 'Not contacted', value: suppressed, meta: 'already booked, opted out, bounced, or active' },
      { label: 'Needs re-consent', value: consentFlagged, meta: 'flagged, not emailed' },
      { label: 'Held back to compare', value: holdout, meta: STATE.config.holdoutPercent + '% of each group' }
    ];

    el['summary-tiles'].innerHTML = tiles.map(function (t) {
      return '<div class="stat-tile"><div class="stat-tile__label">' + esc(t.label) + '</div>' +
        '<div class="stat-tile__value' + (t.cls ? ' ' + t.cls : '') + '">' + t.value + '</div>' +
        '<div class="stat-tile__meta">' + esc(t.meta) + '</div></div>';
    }).join('');

    el['results-subtitle'].textContent = total + ' clients reviewed · ' + sequenced + ' being re-engaged';
  }

  // ---------------------------------------------------------------------
  // Rendering — table
  // ---------------------------------------------------------------------

  var TIER_ORDER = { HOT: 0, WARM: 1, COLD: 2 };

  function sortedResults() {
    return STATE.results.slice().sort(function (a, b) {
      var aRank = a.tier ? TIER_ORDER[a.tier] : 3;
      var bRank = b.tier ? TIER_ORDER[b.tier] : 3;
      if (aRank !== bRank) return aRank - bRank;
      return b.score - a.score;
    });
  }

  function tierBadge(tier) {
    if (!tier) return '<span class="cell-muted">—</span>';
    var cls = tier.toLowerCase();
    var label = tier === 'HOT' ? 'Hot' : tier === 'WARM' ? 'Warm' : 'Cold';
    return '<span class="badge badge--' + cls + '"><span class="badge-dot"></span>' + label + '</span>';
  }

  function statusCell(r) {
    var out = '';
    if (r.suppressed_reason === 'needs_express_consent') {
      out += '<span class="badge badge--consent">Needs re-consent</span>';
    } else if (r.suppressed_reason) {
      out += '<span class="badge badge--suppressed">' + esc(SUPPRESSION_LABEL[r.suppressed_reason] || r.suppressed_reason) + '</span>';
      if (r._at_risk) out += ' <span class="badge badge--risk">Slowing down</span>';
    } else if (r.lapsed) {
      out += '<span class="badge badge--suppressed">Lapsed</span>';
    } else {
      out += '<span class="badge badge--not-lapsed">Still on track</span>';
    }
    return out;
  }

  function scoreCell(r) {
    if (!r.tier) return '<span class="cell-muted">—</span>';
    var cls = 'tier-' + r.tier.toLowerCase();
    return '<div class="score-wrap"><div class="score-track"><div class="score-fill ' + cls + '" style="width:' + r.score + '%"></div></div>' +
      '<span class="score-num">' + r.score + '</span></div>';
  }

  function sequenceCell(r) {
    if (!r.sequence.length) return '<span class="seq-empty">—</span>';
    return '<div class="seq-list">' + r.sequence.map(function (s) {
      return '<span class="seq-chip">' + ICONS[s.channel] + 'Day ' + s.day + '</span>';
    }).join('') + '</div>';
  }

  function holdoutCell(r) {
    if (!r.sequence.length) return '<span class="cell-muted">—</span>';
    if (r.holdout) return '<span class="badge badge--holdout" title="No outreach sent, kept as a comparison group">Held back</span>';
    return '<span class="cell-muted">Being contacted</span>';
  }

  function renderTable() {
    var results = sortedResults();
    var rowsHtml = results.map(function (r) {
      var expanded = STATE.expandedId === r.client_id;
      var main = '<tr class="result-row' + (expanded ? ' is-expanded' : '') + '" data-id="' + r.client_id + '">' +
        '<td>' + ICONS.chevron.replace('<svg', '<svg class="row-expand-icon"') + '</td>' +
        '<td><div class="cell-primary">' + esc(r._name) + '</div><div class="cell-sub">' + esc(r._email) + '</div></td>' +
        '<td>' + esc(r.membership_status) + '</td>' +
        '<td>' + esc(r._last_visit_date) + '<div class="cell-sub">' + r.days_since_last_visit + ' days ago</div></td>' +
        '<td>' + statusCell(r) + '</td>' +
        '<td>' + tierBadge(r.tier) + '</td>' +
        '<td>' + scoreCell(r) + '</td>' +
        '<td>' + sequenceCell(r) + '</td>' +
        '<td>' + holdoutCell(r) + '</td>' +
        '</tr>';
      if (!expanded) return main;
      return main + '<tr class="detail-row" data-detail-for="' + r.client_id + '"><td colspan="9">' + renderDetailPanel(r) + '</td></tr>';
    }).join('');

    el['results-tbody'].innerHTML = rowsHtml;
    el['results-tbody'].querySelectorAll('tr.result-row').forEach(function (row) {
      row.addEventListener('click', function () { toggleRow(row.getAttribute('data-id')); });
    });

    // Mobile card fallback
    el['result-cards'].innerHTML = results.map(function (r) {
      return '<div class="result-card" data-id="' + r.client_id + '">' +
        '<div class="result-card-top"><div><div class="cell-primary">' + esc(r._name) + '</div>' +
        '<div class="cell-sub">' + esc(r.membership_status) + ' · ' + r.days_since_last_visit + 'd since last visit</div></div>' +
        tierBadge(r.tier) + '</div>' +
        '<div style="margin-top:8px;">' + statusCell(r) + '</div>' +
        sequenceCell(r) +
        (r.holdout ? '<div style="margin-top:8px;">' + holdoutCell(r) + '</div>' : '') +
        '</div>';
    }).join('');
    el['result-cards'].querySelectorAll('.result-card').forEach(function (card) {
      card.addEventListener('click', function () { toggleRow(card.getAttribute('data-id')); });
    });
  }

  function toggleRow(id) {
    STATE.expandedId = STATE.expandedId === id ? null : id;
    renderTable();
  }

  // ---------------------------------------------------------------------
  // Detail panel
  // ---------------------------------------------------------------------

  function reasoningText(r) {
    if (r.suppressed_reason === 'has_future_booking') {
      return 'Already has a future booking on the calendar, so reaching out again would just be redundant.';
    }
    if (r.suppressed_reason === 'opted_out') {
      return 'Opted out of marketing contact — left alone no matter how lapsed they get.';
    }
    if (r.suppressed_reason === 'email_hard_bounced') {
      return 'Their email is bouncing. Their visit history would otherwise make them a strong candidate, but sending would only hurt deliverability for every other client.';
    }
    if (r.suppressed_reason === 'active_member') {
      return r._at_risk
        ? 'Still an active, paying member — never part of win-back. Their visits have slowed well below their own usual pace though, worth a personal check-in outside this campaign.'
        : 'Still an active, paying member, visiting on their usual schedule. No action needed.';
    }
    if (r.suppressed_reason === 'needs_express_consent') {
      return 'Hasn’t visited or transacted in over ' + STATE.config.consentExpiryMonths + ' months, so consent has expired under Canadian rules. Flagged for a fresh opt-in rather than emailed automatically — the priority below is what they’d be worth once that happens.';
    }
    if (!r.lapsed) {
      return 'Still within their usual visiting window — too soon to call this a win-back case.';
    }
    var vpw = r._score_breakdown.visitsPerWeek;
    var freqNote = vpw >= 2
      ? 'They were visiting 2+ times a week — that kind of drop-off usually means life got in the way, not that they lost interest.'
      : vpw >= 0.6
      ? 'A steady, moderate visit history before they went quiet.'
      : 'Only a sparse, drop-in history to go on.';
    return r.days_since_last_visit + ' days since their last visit, well past when we’d expect them back. ' + freqNote;
  }

  function renderDetailPanel(r) {
    var client = clientById(r.client_id);
    var b = r._score_breakdown;
    var visitsHtml = client.visit_history.slice().sort(function (a, b2) { return a.date < b2.date ? 1 : -1; })
      .map(function (v) {
        return '<li><span>' + esc(v.date) + ' — ' + esc(v.class_type) + '</span><span class="vh-amount">$' + v.amount + '</span></li>';
      }).join('');

    return '<div class="detail-panel">' +
      '<div class="detail-block">' +
        '<h4>Why this client</h4>' +
        '<p class="reasoning-text">' + reasoningText(r) + '</p>' +
        (r.tier ? (
          '<h4>How we scored it (' + r.score + ' / 100)</h4>' +
          breakdownRow('Visit frequency', b.freqScore, 65) +
          breakdownRow('How overdue', b.recencyScore, 15) +
          breakdownRow('Lifetime spend', b.spendScore, 20) +
          '<p class="field-hint" style="margin-top:10px;">$' + r._lifetime_spend + ' in lifetime spend across ' + r._visit_count + ' visits — worth about ' + money(estimatedMonthlyValue(r)) + '/mo if they were still coming in at their usual pace.</p>'
        ) : '') +
      '</div>' +
      '<div class="detail-block">' +
        '<h4>Recent visits (' + client.visit_history.length + ')</h4>' +
        '<ul class="visit-history-list">' + visitsHtml + '</ul>' +
      '</div>' +
    '</div>';
  }

  function breakdownRow(label, value, max) {
    var pct = Math.round((value / max) * 100);
    return '<div class="breakdown-row"><span class="breakdown-label">' + esc(label) + '</span>' +
      '<div class="breakdown-track"><div class="breakdown-fill" style="width:' + pct + '%"></div></div>' +
      '<span class="breakdown-val">' + value + '/' + max + '</span></div>';
  }

  // ---------------------------------------------------------------------
  // Small utils
  // ---------------------------------------------------------------------

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderAll() {
    renderSummary();
    renderTable();
  }

  // ---------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------

  function init() {
    cacheEls();
    document.getElementById('brand-name').textContent = DEMO_BUSINESS.name;
    document.getElementById('brand-tagline').textContent = DEMO_BUSINESS.product;
    applyConfigToForm(STATE.config);
    bindLiveLabels();

    el['btn-run'].addEventListener('click', run);
    el['restart-demo'].addEventListener('click', function () {
      STATE.config = ENGINE.defaultConfig();
      applyConfigToForm(STATE.config);
      run();
    });

    run();
  }

  init();
})();
