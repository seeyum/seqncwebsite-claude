/**
 * Greyhouse Ops — canned demo data.
 * Everything here is fictional. TODAY is a fixed simulated date (not the real
 * clock) so the calendar, timeline, and "this week" numbers always look
 * populated and never drift stale.
 */

var DEMO_TODAY = '2026-06-15';

var DEMO_SEED = {
  agency: {
    name: 'Greyhouse Studio',
    product: 'Greyhouse Ops',
    mrr_target: 6000
  },

  users: [
    { id: 'owner-01', full_name: 'Morgan Ellery', email: 'morgan@greyhouse.studio', role: 'owner' },
    { id: 'admin-01', full_name: 'Devon Cole', email: 'devon@greyhouse.studio', role: 'admin' },
    { id: 'admin-02', full_name: 'Riley Shaw', email: 'riley@greyhouse.studio', role: 'admin' },
    { id: 'client-01', full_name: 'Ines Barreto', email: 'ines@cedarandvine.co', role: 'client' },
    { id: 'client-02', full_name: 'Thomas Marlowe', email: 'thomas@marlowefamilylaw.com', role: 'client' },
    { id: 'client-03', full_name: 'Priya Anand', email: 'priya@kettlebellcollective.com', role: 'client' },
    { id: 'client-04', full_name: 'Ben Okafor', email: 'ben@northshoredental.com', role: 'client' },
    { id: 'client-05', full_name: 'Lucia Ferrante', email: 'lucia@roasthouseco.com', role: 'client' },
    { id: 'client-06', full_name: 'Sam Whitfield', email: 'sam@wrenandco.studio', role: 'client' }
  ],

  clients: [
    {
      id: 'client-01',
      full_name: 'Ines Barreto',
      business_name: 'Cedar & Vine',
      industry: 'Landscaping',
      package: 'Business',
      status: 'Work In Progress',
      mrr_value: 420,
      setup_fee: 1200,
      build_start_date: '2026-05-18',
      planned_delivery_date: '2026-06-29',
      admin_notes: 'Prefers text over email for quick questions. Wants a seasonal-planting blog section down the line.',
      project_scope: 'Full rebuild of the Cedar & Vine site: homepage, services, portfolio gallery, and a quote-request form that routes to their inbox. Warm, natural palette; mobile-first.',
      client_notes: 'Could we get a before/after slider for the portfolio photos? Also — is a blog something we can add after launch?',
      client_notes_updated_at: '2026-06-10T15:40:00Z',
      drive_connected: true,
      onboarded_at: '2026-05-20T09:00:00Z',
      created_at: '2026-05-15T10:00:00Z'
    },
    {
      id: 'client-02',
      full_name: 'Thomas Marlowe',
      business_name: 'Marlowe Family Law',
      industry: 'Legal',
      package: 'E-Commerce',
      status: 'Waiting Onboarding',
      mrr_value: 640,
      setup_fee: 1800,
      build_start_date: null,
      planned_delivery_date: null,
      admin_notes: 'Referred by Cedar & Vine. Wants everything reviewed by their office manager before it goes live.',
      project_scope: '',
      client_notes: '',
      client_notes_updated_at: null,
      drive_connected: true,
      onboarded_at: null,
      created_at: '2026-06-08T11:00:00Z'
    },
    {
      id: 'client-03',
      full_name: 'Priya Anand',
      business_name: 'Kettlebell Collective',
      industry: 'Fitness',
      package: 'Starter',
      status: 'Delivered',
      mrr_value: 260,
      setup_fee: 750,
      build_start_date: '2026-03-02',
      planned_delivery_date: '2026-04-10',
      admin_notes: 'Delivered on schedule. Very happy — asked about a referral discount for other gym owners.',
      project_scope: 'Single-page site for a boutique kettlebell studio: class schedule, trainer bios, and a membership sign-up CTA.',
      client_notes: 'This is exactly what we wanted, thank you! Sent it to two other gym owners already.',
      client_notes_updated_at: '2026-04-11T13:05:00Z',
      drive_connected: true,
      onboarded_at: '2026-03-04T09:30:00Z',
      created_at: '2026-02-18T09:00:00Z'
    },
    {
      id: 'client-04',
      full_name: 'Ben Okafor',
      business_name: 'Northshore Dental',
      industry: 'Healthcare',
      package: 'Business',
      status: 'Onboarded',
      mrr_value: 520,
      setup_fee: 1500,
      build_start_date: '2026-06-22',
      planned_delivery_date: '2026-07-31',
      admin_notes: 'Wants online appointment requests. Check whether their scheduling software has an embeddable widget.',
      project_scope: 'New site for a two-chair dental practice: services, insurance info, new-patient forms, and an appointment-request form.',
      client_notes: 'Please make sure the new-patient forms are easy to fill out on mobile — most people book from their phones.',
      client_notes_updated_at: '2026-06-05T10:15:00Z',
      drive_connected: false,
      onboarded_at: '2026-06-01T09:00:00Z',
      created_at: '2026-05-22T14:00:00Z'
    },
    {
      id: 'client-05',
      full_name: 'Lucia Ferrante',
      business_name: 'Roasthouse Coffee Co.',
      industry: 'Food & Beverage',
      package: 'Custom',
      status: 'New Updates',
      mrr_value: 780,
      setup_fee: 2200,
      build_start_date: '2026-04-06',
      planned_delivery_date: '2026-06-05',
      admin_notes: 'Added an online ordering banner per their request. Waiting on their sign-off before it stays live.',
      project_scope: 'Full site with online ordering integration, roast catalogue, wholesale inquiry page, and a locations map.',
      client_notes: 'The ordering banner looks great — one small thing, can the button be a bit bigger on mobile?',
      client_notes_updated_at: '2026-06-13T08:50:00Z',
      drive_connected: true,
      onboarded_at: '2026-04-08T09:00:00Z',
      created_at: '2026-03-28T10:00:00Z'
    },
    {
      id: 'client-06',
      full_name: 'Sam Whitfield',
      business_name: 'Wren & Co. Studio',
      industry: 'Creative / Design',
      package: 'Starter',
      status: 'Waiting Onboarding',
      mrr_value: 260,
      setup_fee: 750,
      build_start_date: null,
      planned_delivery_date: null,
      admin_notes: '',
      project_scope: '',
      client_notes: '',
      client_notes_updated_at: null,
      drive_connected: false,
      onboarded_at: null,
      created_at: '2026-06-13T16:00:00Z'
    }
  ],

  // Onboarding item templates, keyed by client id. Each array becomes that
  // client's checklist, grouped by `category` in the UI.
  onboardingItems: {
    'client-01': [
      { id: 'oi-01-01', category: 'Business Information', label: 'Business description', type: 'text', answer_text: 'Cedar & Vine designs and maintains residential landscapes across the north valley — planting, irrigation, and seasonal upkeep.', file_name: null, status: 'approved', admin_note: null, is_optional: false },
      { id: 'oi-01-02', category: 'Business Information', label: 'Target audience', type: 'text', answer_text: 'Homeowners aged 35–65 in higher-end suburban neighborhoods who want low-maintenance, well-designed yards.', file_name: null, status: 'approved', admin_note: null, is_optional: false },
      { id: 'oi-01-03', category: 'Business Information', label: 'Competitors or inspiration sites', type: 'text', answer_text: 'greenridge-landscaping.com', file_name: null, status: 'revision_requested', admin_note: 'Could you add one or two more examples? Want to nail the style direction before we start.', is_optional: false },
      { id: 'oi-01-04', category: 'Branding', label: 'Logo files (PNG / SVG)', type: 'file', answer_text: null, file_name: 'cedar-vine-logo.svg', status: 'approved', admin_note: null, is_optional: false },
      { id: 'oi-01-05', category: 'Branding', label: 'Brand color preferences', type: 'text', answer_text: 'Deep forest green, warm cream, a touch of terracotta for accents.', file_name: null, status: 'approved', admin_note: null, is_optional: false },
      { id: 'oi-01-06', category: 'Branding', label: 'Font preferences or brand kit', type: 'file', answer_text: null, file_name: null, status: 'pending', admin_note: null, is_optional: true },
      { id: 'oi-01-07', category: 'Content', label: 'Website copy', type: 'file', answer_text: null, file_name: 'cedar-vine-copy-draft.docx', status: 'submitted', admin_note: null, is_optional: false },
      { id: 'oi-01-08', category: 'Content', label: 'Team photos', type: 'file', answer_text: null, file_name: 'crew-photos.zip', status: 'approved', admin_note: null, is_optional: true },
      { id: 'oi-01-09', category: 'Technical & Credentials', label: 'Domain registrar access', type: 'text', answer_text: 'Namecheap — shared via secure note.', file_name: null, status: 'approved', admin_note: null, is_optional: false },
      { id: 'oi-01-10', category: 'Technical & Credentials', label: 'Social media links', type: 'text', answer_text: 'Instagram: @cedarandvine', file_name: null, status: 'approved', admin_note: null, is_optional: true }
    ],
    'client-02': [
      { id: 'oi-02-01', category: 'Business Information', label: 'Business description', type: 'text', answer_text: null, file_name: null, status: 'pending', admin_note: null, is_optional: false },
      { id: 'oi-02-02', category: 'Business Information', label: 'Target audience', type: 'text', answer_text: null, file_name: null, status: 'pending', admin_note: null, is_optional: false },
      { id: 'oi-02-03', category: 'Branding', label: 'Logo files (PNG / SVG)', type: 'file', answer_text: null, file_name: null, status: 'pending', admin_note: null, is_optional: false },
      { id: 'oi-02-04', category: 'Branding', label: 'Brand color preferences', type: 'text', answer_text: null, file_name: null, status: 'pending', admin_note: null, is_optional: false },
      { id: 'oi-02-05', category: 'Technical & Credentials', label: 'Domain registrar access', type: 'text', answer_text: null, file_name: null, status: 'pending', admin_note: null, is_optional: false }
    ],
    'client-03': [
      { id: 'oi-03-01', category: 'Business Information', label: 'Business description', type: 'text', answer_text: 'A boutique kettlebell and conditioning studio focused on small-group coaching.', file_name: null, status: 'approved', admin_note: null, is_optional: false },
      { id: 'oi-03-02', category: 'Branding', label: 'Logo files (PNG / SVG)', type: 'file', answer_text: null, file_name: 'kbc-logo-final.ai', status: 'approved', admin_note: null, is_optional: false },
      { id: 'oi-03-03', category: 'Content', label: 'Website copy', type: 'file', answer_text: null, file_name: 'kbc-copy-final.docx', status: 'approved', admin_note: null, is_optional: false }
    ],
    'client-04': [
      { id: 'oi-04-01', category: 'Business Information', label: 'Business description', type: 'text', answer_text: 'A two-chair family dental practice open six days a week, focused on same-week appointments.', file_name: null, status: 'approved', admin_note: null, is_optional: false },
      { id: 'oi-04-02', category: 'Business Information', label: 'Target audience', type: 'text', answer_text: 'Families within a 10-minute drive, especially households looking for a new dentist after a move.', file_name: null, status: 'approved', admin_note: null, is_optional: false },
      { id: 'oi-04-03', category: 'Branding', label: 'Logo files (PNG / SVG)', type: 'file', answer_text: null, file_name: 'northshore-dental-logo.png', status: 'approved', admin_note: null, is_optional: false },
      { id: 'oi-04-04', category: 'Branding', label: 'Brand color preferences', type: 'text', answer_text: 'Soft teal and white — clean, calm, not clinical.', file_name: null, status: 'approved', admin_note: null, is_optional: false },
      { id: 'oi-04-05', category: 'Content', label: 'Website copy', type: 'file', answer_text: null, file_name: 'nsd-website-copy.docx', status: 'submitted', admin_note: null, is_optional: false },
      { id: 'oi-04-06', category: 'Technical & Credentials', label: 'Domain registrar access', type: 'text', answer_text: 'GoDaddy — invite sent to team@greyhouse.studio', file_name: null, status: 'approved', admin_note: null, is_optional: false }
    ],
    'client-05': [
      { id: 'oi-05-01', category: 'Business Information', label: 'Business description', type: 'text', answer_text: 'A single-location specialty coffee roaster with wholesale accounts across the region.', file_name: null, status: 'approved', admin_note: null, is_optional: false },
      { id: 'oi-05-02', category: 'Branding', label: 'Logo files (PNG / SVG)', type: 'file', answer_text: null, file_name: 'roasthouse-logo-pack.zip', status: 'approved', admin_note: null, is_optional: false },
      { id: 'oi-05-03', category: 'Content', label: 'Website copy', type: 'file', answer_text: null, file_name: 'roasthouse-copy-v3.docx', status: 'approved', admin_note: null, is_optional: false },
      { id: 'oi-05-04', category: 'Technical & Credentials', label: 'Domain registrar access', type: 'text', answer_text: 'Squarespace domains — access shared.', file_name: null, status: 'approved', admin_note: null, is_optional: false }
    ],
    'client-06': [
      { id: 'oi-06-01', category: 'Business Information', label: 'Business description', type: 'text', answer_text: null, file_name: null, status: 'pending', admin_note: null, is_optional: false },
      { id: 'oi-06-02', category: 'Business Information', label: 'Target audience', type: 'text', answer_text: null, file_name: null, status: 'pending', admin_note: null, is_optional: false },
      { id: 'oi-06-03', category: 'Branding', label: 'Logo files (PNG / SVG)', type: 'file', answer_text: null, file_name: null, status: 'pending', admin_note: null, is_optional: false }
    ]
  },

  // Weekly sales pipeline log, most recent first isn't required — sorted ascending by week_start.
  pipelineWeeks: [
    { week_start: '2026-04-13', contacted: 36, replied: 14, calls_booked: 7, proposals_sent: 4, deals_closed: 2 },
    { week_start: '2026-04-20', contacted: 41, replied: 17, calls_booked: 9, proposals_sent: 6, deals_closed: 3 },
    { week_start: '2026-04-27', contacted: 33, replied: 12, calls_booked: 6, proposals_sent: 4, deals_closed: 1 },
    { week_start: '2026-05-04', contacted: 48, replied: 20, calls_booked: 11, proposals_sent: 7, deals_closed: 3 },
    { week_start: '2026-05-11', contacted: 39, replied: 15, calls_booked: 8, proposals_sent: 5, deals_closed: 2 },
    { week_start: '2026-05-18', contacted: 45, replied: 19, calls_booked: 10, proposals_sent: 7, deals_closed: 4 },
    { week_start: '2026-05-25', contacted: 52, replied: 22, calls_booked: 12, proposals_sent: 8, deals_closed: 3 },
    { week_start: '2026-06-01', contacted: 44, replied: 18, calls_booked: 9, proposals_sent: 6, deals_closed: 2 },
    { week_start: '2026-06-08', contacted: 50, replied: 21, calls_booked: 11, proposals_sent: 8, deals_closed: 4 }
  ],

  weeklyLogs: [
    { user_id: 'owner-01', week_start: '2026-06-08', contacts: 22, calls_completed: 6, clients_closed: 2, revenue_closed: 1160 },
    { user_id: 'admin-01', week_start: '2026-06-08', contacts: 16, calls_completed: 4, clients_closed: 1, revenue_closed: 640 },
    { user_id: 'admin-02', week_start: '2026-06-08', contacts: 12, calls_completed: 3, clients_closed: 1, revenue_closed: 420 },
    { user_id: 'owner-01', week_start: '2026-06-01', contacts: 19, calls_completed: 5, clients_closed: 1, revenue_closed: 780 },
    { user_id: 'admin-01', week_start: '2026-06-01', contacts: 14, calls_completed: 3, clients_closed: 1, revenue_closed: 520 },
    { user_id: 'admin-02', week_start: '2026-06-01', contacts: 10, calls_completed: 2, clients_closed: 0, revenue_closed: 0 }
  ],

  goals: [
    { user_id: 'owner-01', month: '2026-06', contacts_goal: 90, calls_goal: 22, closed_goal: 8, revenue_goal: 5200 },
    { user_id: 'admin-01', month: '2026-06', contacts_goal: 70, calls_goal: 16, closed_goal: 5, revenue_goal: 3200 },
    { user_id: 'admin-02', month: '2026-06', contacts_goal: 55, calls_goal: 12, closed_goal: 4, revenue_goal: 2400 }
  ],

  integrations: [
    { key: 'calendar', label: 'Calendar (discovery calls)', connected: true },
    { key: 'drive', label: 'Shared drive folders', connected: true },
    { key: 'payments', label: 'Payments / MRR sync', connected: true },
    { key: 'ads', label: 'Ad platform snapshot', connected: false }
  ],

  discoveryCalls: { booked: 11, completed: 8, show_rate: 73 }
};
