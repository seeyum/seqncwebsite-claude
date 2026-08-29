/**
 * Redline Fitness Studio — canned demo data for the Outbound Win-Back Engine.
 * DEMO_TODAY is a fixed simulated date (not the real clock) so every
 * "days since last visit" / lapsed calculation stays consistent between
 * visits to the page and never drifts stale.
 *
 * Fifteen synthetic clients, deliberately covering every branch of the
 * engine: high-frequency-now-overdue, drop-in one-timers, an active member
 * still visiting, an active member whose pace has slowed (at-risk), a
 * cancelled membership that's always lapsed regardless of interval,
 * opted-out, hard-bounced, future-booking, CASL consent-expired, and a
 * client who is simply too recent to call lapsed yet.
 */

var DEMO_TODAY = '2026-08-20';

function isoAddDays(iso, delta) {
  var p = iso.split('-').map(Number);
  var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

// Builds a descending run of "days ago" values from startDaysAgo down to
// endDaysAgo, stepping by the (cycled) gaps in `intervals` — i.e. a
// realistic visit cadence. Output is oldest-first (largest days-ago first).
function genDaysAgoSeries(startDaysAgo, endDaysAgo, intervals) {
  var out = [startDaysAgo];
  var cursor = startDaysAgo;
  var i = 0;
  while (true) {
    var next = cursor - intervals[i % intervals.length];
    if (next < endDaysAgo) break;
    out.push(next);
    cursor = next;
    i++;
  }
  return out;
}

function toVisits(daysAgoList, classType, amount) {
  return daysAgoList
    .slice()
    .sort(function (a, b) { return b - a; }) // oldest (largest days-ago) first
    .map(function (n) { return { date: isoAddDays(DEMO_TODAY, -n), class_type: classType, amount: amount }; });
}

function lastVisitDate(visits) {
  return visits[visits.length - 1].date;
}

// ---------------------------------------------------------------------
// Client roster
// ---------------------------------------------------------------------

var clientDefs = [
  {
    id: 'c001', name: 'Jordan Vasquez', email: 'jordan.vasquez@example.com', phone: '(604) 555-0131',
    membership_status: 'paused',
    visits: toVisits(genDaysAgoSeries(110, 27, [2, 2, 3]), 'Group HIIT', 32),
    note: 'High-frequency-now-overdue — 3x/week for months, then stopped ~4 weeks ago.'
  },
  {
    id: 'c002', name: 'Maya Okonkwo', email: 'maya.okonkwo@example.com', phone: '(416) 555-0147',
    membership_status: 'cancelled',
    visits: toVisits(genDaysAgoSeries(90, 25, [7]), 'Vinyasa Flow', 28),
    note: 'Cancelled membership — moderate weekly consistency before cancelling.'
  },
  {
    id: 'c003', name: 'Devon Cole', email: 'devon.cole@example.com', phone: '(778) 555-0102',
    membership_status: 'drop-in-only',
    visits: toVisits([95], 'Drop-in Spin', 22),
    note: 'Drop-in one-timer — a single class, long lapsed.'
  },
  {
    id: 'c004', name: 'Priya Anand', email: 'priya.anand@example.com', phone: '(647) 555-0118',
    membership_status: 'active',
    has_future_booking: false,
    visits: toVisits(genDaysAgoSeries(60, 3, [7]), 'Strength Circuit', 30),
    note: 'Active member, still visiting weekly — excluded from win-back entirely.'
  },
  {
    id: 'c005', name: 'Sam Whitfield', email: 'sam.whitfield@example.com', phone: '(905) 555-0164',
    membership_status: 'active',
    visits: toVisits(genDaysAgoSeries(150, 60, [7]).concat(genDaysAgoSeries(50, 12, [22])), 'Bootcamp', 26),
    note: 'Active member whose visit pace has clearly slowed — flagged at_risk, still excluded from win-back.'
  },
  {
    id: 'c006', name: 'Elena Cruz', email: 'elena.cruz@example.com', phone: '(587) 555-0173',
    membership_status: 'cancelled',
    visits: toVisits(genDaysAgoSeries(100, 20, [2]), 'Powerlifting Coaching', 38),
    note: 'Cancelled membership, was visiting almost every other day — always lapsed, scores HOT on frequency.'
  },
  {
    id: 'c007', name: 'Marcus Ferreira', email: 'marcus.ferreira@example.com', phone: '(403) 555-0156',
    membership_status: 'paused',
    has_future_booking: true,
    visits: toVisits(genDaysAgoSeries(150, 60, [10]), 'Yoga Basics', 25),
    note: 'Looks lapsed by history alone, but already has a future booking on the books — suppressed.'
  },
  {
    id: 'c008', name: 'Ines Delgado', email: 'ines.delgado@example.com', phone: '(613) 555-0189',
    membership_status: 'paused',
    opted_out: true,
    visits: toVisits(genDaysAgoSeries(120, 80, [10]), 'Spin', 24),
    note: 'Opted out of marketing contact — suppressed regardless of lapse status.'
  },
  {
    id: 'c009', name: 'Ben Okafor', email: 'ben.okafor@example.com', phone: '(519) 555-0122',
    membership_status: 'cancelled',
    email_hard_bounced: true,
    visits: toVisits(genDaysAgoSeries(90, 15, [2, 3]), 'Group HIIT', 33),
    note: 'Would otherwise be a strong HOT candidate — email hard-bounced, suppressed to protect sender reputation.'
  },
  {
    id: 'c010', name: 'Lucia Marlowe', email: 'lucia.marlowe@example.com', phone: '(250) 555-0195',
    membership_status: 'paused',
    visits: toVisits(genDaysAgoSeries(820, 760, [10]), 'Reformer Pilates', 34),
    note: "CASL implied consent expired — last transaction over 24 months ago. Flagged, not dropped."
  },
  {
    id: 'c011', name: 'Riley Shaw', email: 'riley.shaw@example.com', phone: '(514) 555-0141',
    membership_status: 'paused',
    visits: toVisits(genDaysAgoSeries(130, 30, [10]), 'Reformer Pilates', 30),
    note: 'Moderate, consistent biweekly history — moderately lapsed. Textbook WARM.'
  },
  {
    id: 'c012', name: 'Thomas Bekele', email: 'thomas.bekele@example.com', phone: '(306) 555-0167',
    membership_status: 'drop-in-only',
    visits: toVisits([200, 190], 'Drop-in Spin', 20),
    note: 'Two sparse drop-ins, both a long time ago — COLD, no incentive spend.'
  },
  {
    id: 'c013', name: 'Nadia Petrov', email: 'nadia.petrov@example.com', phone: '(902) 555-0138',
    membership_status: 'paused',
    visits: toVisits(genDaysAgoSeries(90, 7, [2, 2, 3]), 'Group HIIT', 34),
    note: 'Same high-frequency pattern as Jordan, but only just crossed the lapsed threshold — a fresher HOT lead.'
  },
  {
    id: 'c014', name: 'Owen Castillo', email: 'owen.castillo@example.com', phone: '(867) 555-0129',
    membership_status: 'cancelled',
    visits: toVisits(genDaysAgoSeries(80, 15, [8]), 'Strength Circuit', 27),
    note: "Cancelled membership forces lapsed=true even though he isn't very overdue by interval alone — edge case."
  },
  {
    id: 'c015', name: 'Grace Lindqvist', email: 'grace.lindqvist@example.com', phone: '(709) 555-0114',
    membership_status: 'drop-in-only',
    visits: toVisits([5], 'Drop-in Spin', 22),
    note: 'A single, very recent drop-in — too soon to call lapsed. Not suppressed, just not due yet.'
  }
];

var DEMO_CLIENTS = clientDefs.map(function (c) {
  return {
    client_id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    membership_status: c.membership_status,
    visit_history: c.visits,
    has_future_booking: !!c.has_future_booking,
    opted_out: !!c.opted_out,
    email_hard_bounced: !!c.email_hard_bounced,
    consent_date: lastVisitDate(c.visits),
    _demo_note: c.note
  };
});

var DEMO_BUSINESS = {
  name: 'Redline Fitness Studio',
  product: 'Redline Win-Back Engine',
  tagline: "Segmentation & sequencing engine for client win-back — built for boutique fitness and gym operators."
};
