// Static content for the standalone Inbound Estimator demo page.
// Mirrors the real app's data/form-config.json + data/pricing-matrix.json
// verbatim, so the demo asks the same questions and prices the same way -
// the only thing that's fake is that nothing here is submitted anywhere.
window.DEMO_DATA = {
  business: { name: "Demo HVAC Co.", phone: "(555) 010-1234", email: "owner@example.com", currency: "CAD" },

  urgencyTiers: [
    { id: "emergency", label: "Emergency", description: "Active water leak, no heat in winter, gas smell - needs attention now." },
    { id: "urgent", label: "Urgent", description: "Needs fixing within 48 hours." },
    { id: "routine", label: "Routine", description: "Planned work, flexible timing." },
  ],

  categories: [
    { id: "no_heat", label: "No Heat" },
    { id: "no_cooling", label: "No Cooling" },
    { id: "noise_smell_leak", label: "Strange Noise, Smell, or Leak" },
    { id: "thermostat", label: "Thermostat Issue" },
    { id: "maintenance", label: "Routine Maintenance / Tune-Up" },
    { id: "new_install", label: "New System Installation / Replacement" },
    { id: "air_quality", label: "Indoor Air Quality" },
    { id: "other", label: "Other / Not Sure" },
  ],

  emergencyQuestions: [
    {
      id: "eq_unsafe",
      type: "yes_no",
      label: "Is anyone in the home currently unsafe (extreme indoor temperature, active leak, or gas smell)?",
      required: true,
    },
  ],

  questions: {
    no_heat: {
      default: [
        { id: "nh_gas_smell", type: "yes_no", label: "Is there a strong gas smell right now?", required: true, safetyFlag: true },
        { id: "nh_age", type: "single_select", label: "How old is your heating system?", options: ["Under 5 years", "5-15 years", "15+ years", "Not sure"], required: true },
        { id: "nh_recurring", type: "yes_no", label: "Has this happened before in the last 6 months?", required: false },
        { id: "nh_notes", type: "free_text", label: "Anything else you've noticed (smells, noises, error codes)?", required: false },
      ],
    },
    no_cooling: {
      default: [
        { id: "nc_outdoor_running", type: "yes_no", label: "Is the outdoor unit running at all (any sound or fan movement)?", required: true },
        { id: "nc_age", type: "single_select", label: "How old is your cooling system?", options: ["Under 5 years", "5-15 years", "15+ years", "Not sure"], required: true },
        { id: "nc_ice", type: "yes_no", label: "Is there ice or frost on the unit or refrigerant lines?", required: false },
        { id: "nc_notes", type: "free_text", label: "Anything else you've noticed?", required: false },
      ],
    },
    noise_smell_leak: {
      default: [
        { id: "nsl_what", type: "single_select", label: "What are you noticing?", options: ["Noise", "Smell", "Water leak", "Multiple"], required: true },
        { id: "nsl_water_damage", type: "yes_no", label: "Is there visible water pooling or damage nearby?", required: true },
        { id: "nsl_duration", type: "single_select", label: "How long has this been happening?", options: ["Today", "2-3 days", "Over a week"], required: true },
        { id: "nsl_notes", type: "free_text", label: "Describe what you're seeing or hearing", required: false },
      ],
    },
    thermostat: {
      default: [
        { id: "th_blank", type: "yes_no", label: "Is the thermostat completely blank or unresponsive?", required: true },
        { id: "th_type", type: "single_select", label: "What type of thermostat do you have?", options: ["Basic/manual", "Programmable", "Smart (Nest, Ecobee, etc.)", "Not sure"], required: true },
        { id: "th_batteries", type: "yes_no", label: "Have you already tried replacing the batteries?", required: false },
        { id: "th_notes", type: "free_text", label: "Anything else to add?", required: false },
      ],
    },
    maintenance: {
      default: [
        { id: "mt_units", type: "single_select", label: "How many systems/units need service?", options: ["1", "2", "3+"], required: true },
        { id: "mt_last_tuneup", type: "single_select", label: "When was your last tune-up?", options: ["Within 1 year", "1-2 years", "Over 2 years", "Never"], required: true },
        { id: "mt_issues", type: "yes_no", label: "Any performance issues currently, or just preventive maintenance?", required: false },
        { id: "mt_notes", type: "free_text", label: "Anything else to add?", required: false },
      ],
    },
    new_install: {
      default: [
        { id: "ni_what", type: "single_select", label: "What are you looking to replace or install?", options: ["Furnace only", "AC only", "Full system (furnace + AC)", "Ductless mini-split", "Not sure"], required: true },
        { id: "ni_home_size", type: "single_select", label: "Approximate size of your home?", options: ["Under 1500 sqft", "1500-2500 sqft", "2500-4000 sqft", "4000+ sqft"], required: true },
        { id: "ni_emergency_replace", type: "yes_no", label: "Is this an emergency replacement (current system failed) or a planned upgrade?", required: false },
        { id: "ni_notes", type: "free_text", label: "Anything else to add?", required: false },
      ],
    },
    air_quality: {
      default: [
        { id: "aq_interest", type: "single_select", label: "What are you interested in?", options: ["Duct cleaning", "Air purifier", "Humidifier", "Filtration system", "Not sure"], required: true },
        { id: "aq_respiratory", type: "yes_no", label: "Is anyone in the home dealing with allergies, asthma, or other respiratory concerns?", required: false },
        { id: "aq_notes", type: "free_text", label: "Anything else to add?", required: false },
      ],
    },
    other: {
      default: [{ id: "ot_notes", type: "free_text", label: "Tell us what's going on and we'll figure out the right next step.", required: true }],
    },
  },

  pricing: {
    currency: "CAD",
    roundTo: 5,
    base: {
      no_heat: { low: 175, high: 400 },
      no_cooling: { low: 175, high: 400 },
      noise_smell_leak: { low: 140, high: 320 },
      thermostat: { low: 100, high: 220 },
      maintenance: { low: 99, high: 189 },
      new_install: { low: 5000, high: 11000 },
      air_quality: { low: 280, high: 700 },
      other: { low: 120, high: 350 },
      default: { low: 100, high: 300 },
    },
    urgencyMultipliers: { emergency: 1.5, urgent: 1.15, routine: 1.0 },
    alwaysWiden: ["other"],
    categoryNotes: {
      new_install: "Final installation quote requires a free in-home assessment; this range reflects typical installations in your area.",
      other: "Final pricing confirmed at appointment.",
    },
    answerModifiers: [
      { category: "no_heat", questionId: "nh_age", answerIn: ["15+ years", "Not sure"], addLow: 50, addHigh: 100 },
      { category: "no_heat", questionId: "nh_recurring", answerEquals: "yes", addLow: 0, addHigh: 50 },

      { category: "no_cooling", questionId: "nc_outdoor_running", answerEquals: "no", addLow: 100, addHigh: 250 },
      { category: "no_cooling", questionId: "nc_age", answerIn: ["15+ years", "Not sure"], addLow: 50, addHigh: 100 },
      { category: "no_cooling", questionId: "nc_ice", answerEquals: "yes", addLow: 150, addHigh: 350 },

      { category: "noise_smell_leak", questionId: "nsl_what", answerIn: ["Water leak", "Multiple"], addLow: 60, addHigh: 120 },
      { category: "noise_smell_leak", questionId: "nsl_water_damage", answerEquals: "yes", addLow: 80, addHigh: 200 },
      { category: "noise_smell_leak", questionId: "nsl_duration", answerEquals: "Over a week", addLow: 20, addHigh: 60 },

      { category: "thermostat", questionId: "th_blank", answerEquals: "yes", addLow: 0, addHigh: 30 },
      { category: "thermostat", questionId: "th_type", answerEquals: "Smart (Nest, Ecobee, etc.)", addLow: 40, addHigh: 90 },

      { category: "maintenance", questionId: "mt_units", answerEquals: "2", addLow: 70, addHigh: 70 },
      { category: "maintenance", questionId: "mt_units", answerEquals: "3+", addLow: 140, addHigh: 140 },
      { category: "maintenance", questionId: "mt_last_tuneup", answerIn: ["Over 2 years", "Never"], addLow: 20, addHigh: 50 },
      { category: "maintenance", questionId: "mt_issues", answerEquals: "yes", addLow: 30, addHigh: 80 },

      { category: "new_install", questionId: "ni_what", answerEquals: "Furnace only", addLow: -1500, addHigh: -2500 },
      { category: "new_install", questionId: "ni_what", answerEquals: "AC only", addLow: -1000, addHigh: -2000 },
      { category: "new_install", questionId: "ni_what", answerEquals: "Full system (furnace + AC)", addLow: 0, addHigh: 1500 },
      { category: "new_install", questionId: "ni_what", answerEquals: "Ductless mini-split", addLow: -500, addHigh: -1000 },
      { category: "new_install", questionId: "ni_home_size", answerEquals: "Under 1500 sqft", addLow: -500, addHigh: -1000 },
      { category: "new_install", questionId: "ni_home_size", answerEquals: "2500-4000 sqft", addLow: 500, addHigh: 1000 },
      { category: "new_install", questionId: "ni_home_size", answerEquals: "4000+ sqft", addLow: 1500, addHigh: 3000 },

      { category: "air_quality", questionId: "aq_interest", answerEquals: "Duct cleaning", addLow: -100, addHigh: -200 },
      { category: "air_quality", questionId: "aq_interest", answerEquals: "Humidifier", addLow: 50, addHigh: 100 },
      { category: "air_quality", questionId: "aq_interest", answerEquals: "Filtration system", addLow: 100, addHigh: 250 },
    ],
  },

  // Seed tickets so the Business Owner Dashboard tab never looks empty, even
  // before a visitor completes the booking flow themselves. Fictional people
  // at fictional addresses - fed through the same pricing/messaging pipeline
  // as a live demo submission, just backdated and pre-completed.
  seedBookings: [
    {
      urgency: "emergency",
      categories: ["no_heat"],
      answers: { nh_gas_smell: "no", nh_age: "15+ years", nh_recurring: "yes", nh_notes: "Furnace stopped overnight, whole house is cold.", eq_unsafe: "yes" },
      contact: { name: "Priya Nathan", phone: "(416) 555-0148", email: "priya.n@example.com", address: "48 Birchcliff Ave, Toronto ON" },
      leadSource: "google_ads",
      createdAtOffsetMinutes: 55,
    },
    {
      urgency: "urgent",
      categories: ["no_cooling"],
      answers: { nc_outdoor_running: "no", nc_age: "5-15 years", nc_ice: "yes", nc_notes: "" },
      contact: { name: "Marcus Delray", phone: "(647) 555-0192", email: "m.delray@example.com", address: "12 Fenwood Cres, Mississauga ON" },
      leadSource: "referral",
      createdAtOffsetMinutes: 60 * 7,
    },
    {
      urgency: "routine",
      categories: ["maintenance"],
      answers: { mt_units: "2", mt_last_tuneup: "Over 2 years", mt_issues: "no", mt_notes: "" },
      contact: { name: "Aisha Whitfield", phone: "(905) 555-0117", email: "aisha.w@example.com", address: "901 Lakeshore Rd, Oakville ON" },
      leadSource: "direct",
      createdAtOffsetMinutes: 60 * 26,
    },
  ],
};
