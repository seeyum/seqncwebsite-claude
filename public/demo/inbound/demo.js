(function () {
  "use strict";

  // Self-contained demo replica of the real Inbound Estimator app. Same
  // questions, same pricing rules, same message copy, same calendar-window
  // logic - all ported from the real server-side code (pricingEngine.js,
  // notificationService.js, calendarHelpers.js/calendar.mock.js,
  // calendarService.js) so the demo behaves identically, just entirely in
  // the browser: no fetch calls, no server, nothing persisted anywhere.

  const DATA = window.DEMO_DATA;
  const STEP_ORDER = ["urgency", "category", "symptoms", "slot", "contact", "confirmation"];
  const PROGRESS_STEPS = ["urgency", "category", "symptoms", "slot", "contact"];

  // Compressed from the real app's 15-30s so a demo visitor isn't kept
  // waiting - still long enough to read as "we looked at your answers"
  // rather than an instant auto-reply.
  const ESTIMATE_DELAY_MS_MIN = 4000;
  const ESTIMATE_DELAY_MS_MAX = 6500;

  const STANDARD_HOURS = [8, 10, 12, 14, 16];
  const EMERGENCY_HOURS = [7, 12, 18];
  const BUSINESS_DAYS_AHEAD = 8;

  // ---------- small helpers ----------

  function formatMoney(n) {
    return "$" + Number(n).toLocaleString("en-CA");
  }

  function newId(prefix) {
    return prefix + "_" + Math.random().toString(36).slice(2, 10);
  }

  function roundToInc(value, increment) {
    return Math.round(value / increment) * increment;
  }

  // ---------- calendar (ported from calendarHelpers.js + calendar.mock.js) ----------

  function nextBusinessDays(count, startOffsetDays) {
    const days = [];
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    cursor.setDate(cursor.getDate() + startOffsetDays);
    while (days.length < count) {
      const dow = cursor.getDay();
      if (dow !== 0 && dow !== 6) days.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }

  function formatSlotLabel(start, end) {
    return (
      start.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" }) +
      " - " +
      start.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" }) +
      " to " +
      end.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })
    );
  }

  function buildSlot(date, hour, kind) {
    const start = new Date(date);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(start.getHours() + 1);
    return {
      id: newId("slot"),
      date: start.toISOString().slice(0, 10),
      start: start.toISOString(),
      end: end.toISOString(),
      label: formatSlotLabel(start, end),
      kind,
      booked: false,
      bookingId: null,
    };
  }

  let slots = null; // Map<id, slot>

  function generateSlotWindow() {
    const map = new Map();
    const days = nextBusinessDays(BUSINESS_DAYS_AHEAD, 1);
    days.forEach((day) => {
      STANDARD_HOURS.forEach((hour) => {
        const slot = buildSlot(day, hour, "standard");
        map.set(slot.id, slot);
      });
      EMERGENCY_HOURS.forEach((hour) => {
        const slot = buildSlot(day, hour, "emergency_hold");
        map.set(slot.id, slot);
      });
    });
    return map;
  }

  // A handful of slots start pre-booked purely so the demo doesn't look
  // suspiciously empty - not tied to any real booking.
  function seedRandomlyBooked() {
    const byDate = new Map();
    for (const slot of slots.values()) {
      if (!byDate.has(slot.date)) byDate.set(slot.date, []);
      byDate.get(slot.date).push(slot);
    }
    let dayIndex = 0;
    byDate.forEach((daySlots) => {
      const standard = daySlots.filter((s) => s.kind === "standard");
      const holds = daySlots.filter((s) => s.kind === "emergency_hold");
      if (dayIndex % 2 === 0 && standard.length > 1) {
        standard[0].booked = true;
        standard[0].bookingId = "seed";
      }
      if (dayIndex === 0 && holds.length > 0) {
        holds[0].booked = true;
        holds[0].bookingId = "seed";
      }
      dayIndex += 1;
    });
  }

  function getRawSlots() {
    return Array.from(slots.values());
  }

  function getAvailableSlots(urgency) {
    const kind = urgency === "emergency" ? "emergency_hold" : "standard";
    return getRawSlots()
      .filter((s) => s.kind === kind && !s.booked)
      .sort((a, b) => (a.start < b.start ? -1 : 1));
  }

  function reserveSlot(slotId, urgency, bookingId) {
    const kind = urgency === "emergency" ? "emergency_hold" : "standard";
    const slot = slots.get(slotId);
    if (!slot || slot.kind !== kind || slot.booked) {
      return { ok: false, message: "Slot is no longer available." };
    }
    slot.booked = true;
    slot.bookingId = bookingId;
    return { ok: true, slot };
  }

  function getAdminSlotView() {
    const raw = getRawSlots();
    const byDate = new Map();
    raw.forEach((slot) => {
      if (!byDate.has(slot.date)) byDate.set(slot.date, []);
      byDate.get(slot.date).push(slot);
    });
    const sortedDates = Array.from(byDate.keys()).sort();
    const today = sortedDates[0] || new Date().toISOString().slice(0, 10);
    const days = sortedDates.map((date) => ({
      date,
      slots: byDate.get(date).sort((a, b) => (a.start < b.start ? -1 : 1)),
    }));
    const todaysHolds = raw.filter((s) => s.date === today && s.kind === "emergency_hold");
    const emergencyHoldsTotal = todaysHolds.length;
    const emergencyHoldsUsed = todaysHolds.filter((s) => s.booked).length;
    return {
      today,
      summary: { emergencyHoldsTotal, emergencyHoldsUsed, emergencyHoldsRemaining: emergencyHoldsTotal - emergencyHoldsUsed },
      days,
    };
  }

  // ---------- pricing engine (ported from pricingEngine.js) ----------

  function modifierApplies(rule, category, answers) {
    if (rule.category !== "*" && rule.category !== category) return false;
    const answer = answers[rule.questionId];
    if (rule.answerEquals !== undefined) return String(answer).toLowerCase() === String(rule.answerEquals).toLowerCase();
    if (rule.answerIn !== undefined) return rule.answerIn.some((v) => String(v).toLowerCase() === String(answer).toLowerCase());
    return false;
  }

  function estimateForCategory(category, urgency, answers) {
    const pricing = DATA.pricing;
    const base = pricing.base[category] || pricing.base.default;
    const multiplier = pricing.urgencyMultipliers[urgency] ?? 1.0;
    let low = base.low * multiplier;
    let high = base.high * multiplier;

    pricing.answerModifiers.forEach((rule) => {
      if (modifierApplies(rule, category, answers)) {
        low += rule.addLow;
        high += rule.addHigh;
      }
    });

    if ((pricing.alwaysWiden || []).includes(category)) {
      low *= 0.85;
      high *= 1.25;
    }
    if (low > high) [low, high] = [high, low];
    low = Math.max(0, roundToInc(low, pricing.roundTo || 5));
    high = Math.max(low, roundToInc(high, pricing.roundTo || 5));

    const note = (pricing.categoryNotes || {})[category] || null;
    return { low, high, currency: pricing.currency, note };
  }

  function estimateForCategories(categories, urgency, answers) {
    let low = 0;
    let high = 0;
    const notes = [];
    categories.forEach((category) => {
      const single = estimateForCategory(category, urgency, answers);
      low += single.low;
      high += single.high;
      if (single.note && !notes.includes(single.note)) notes.push(single.note);
    });
    return { low, high, currency: DATA.pricing.currency, note: notes.length ? notes.join(" ") : null };
  }

  // ---------- notification templates (ported from notificationService.js) ----------

  const categoryLabelOf = Object.fromEntries(DATA.categories.map((c) => [c.id, c.label]));
  const urgencyLabelOf = Object.fromEntries(DATA.urgencyTiers.map((u) => [u.id, u.label]));
  const questionsById = {};
  Object.keys(DATA.questions).forEach((categoryId) => {
    DATA.questions[categoryId].default.forEach((q) => (questionsById[q.id] = q));
  });
  DATA.emergencyQuestions.forEach((q) => (questionsById[q.id] = q));

  function formatAnswer(question, rawAnswer) {
    if (question.type === "yes_no") return rawAnswer === "yes" ? "Yes" : "No";
    return rawAnswer;
  }

  function summarizeAnswers(answers) {
    const parts = [];
    Object.keys(answers).forEach((questionId) => {
      const rawAnswer = answers[questionId];
      if (rawAnswer === undefined || rawAnswer === null || rawAnswer === "") return;
      const question = questionsById[questionId];
      if (!question || question.type === "free_text") return;
      parts.push(`${question.label}: ${formatAnswer(question, rawAnswer)}`);
    });
    return parts.join("; ");
  }

  function extractNotes(answers) {
    const noteParts = [];
    Object.keys(answers).forEach((questionId) => {
      const question = questionsById[questionId];
      if (question && question.type === "free_text" && answers[questionId]) noteParts.push(answers[questionId]);
    });
    return noteParts.join(" ");
  }

  function formatRange(estimate) {
    return `$${estimate.low.toLocaleString("en-CA")}-$${estimate.high.toLocaleString("en-CA")} ${estimate.currency}`;
  }

  function formatCategoryLabel(categories) {
    return categories.map((id) => categoryLabelOf[id] || id).join(" + ");
  }

  function buildOwnerBriefs(booking) {
    const categoryLabel = formatCategoryLabel(booking.categories);
    const urgencyLabel = urgencyLabelOf[booking.urgency] || booking.urgency;

    const ownerSms =
      `[SEQNC] New job booked - ${urgencyLabel.toUpperCase()}\n` +
      `Category: ${categoryLabel}\n` +
      `Slot: ${booking.slot.label}\n` +
      `Customer: ${booking.contact.name} | ${booking.contact.phone}\n` +
      `Address: ${booking.contact.address}`;

    const ownerEmail = [
      `Urgency: ${urgencyLabel}`,
      `Job category: ${categoryLabel}`,
      `Symptom summary: ${booking.symptomSummary || "(none)"}`,
      `Customer notes: ${booking.notes || "(none)"}`,
      `Appointment: ${booking.slot.label}`,
      `Photo: ${booking.photoUrl || "(none provided)"}`,
      `Ballpark range: ${formatRange(booking.estimate)}${booking.estimate.note ? " - " + booking.estimate.note : ""}`,
      `Customer: ${booking.contact.name} | ${booking.contact.phone} | ${booking.contact.email}`,
      `Address: ${booking.contact.address}`,
      `Lead source: ${booking.leadSource || "(direct)"}`,
      `Job ticket ID: ${booking.id}`,
    ].join("\n");

    return { ownerSms, ownerEmail };
  }

  function buildCustomerStage1(booking) {
    const sms =
      `Hi ${booking.contact.name}, we've received your request and your appointment is confirmed ` +
      `for ${booking.slot.label}. You'll hear from us shortly with a ballpark estimate. ` +
      `- ${DATA.business.name}`;
    return { customerSmsStage1: sms, customerEmailStage1: sms };
  }

  function buildCustomerStage2(booking) {
    const rangeText = formatRange(booking.estimate);
    const noteText = booking.estimate.note ? ` ${booking.estimate.note}` : "";
    const sms =
      `Hi ${booking.contact.name}, based on what you described, this type of job typically runs ` +
      `${rangeText}.${noteText} See you ${booking.slot.label}. - ${DATA.business.name}`;
    return { customerSmsStage2: sms, customerEmailStage2: sms };
  }

  // ---------- booking store (in-memory only - nothing persisted) ----------

  let bookings = [];

  function relevantAnswers(categories, urgency, answers) {
    const relevantIds = new Set();
    categories.forEach((categoryId) => {
      (DATA.questions[categoryId].default || []).forEach((q) => relevantIds.add(q.id));
    });
    if (urgency === "emergency") DATA.emergencyQuestions.forEach((q) => relevantIds.add(q.id));
    const out = {};
    Object.keys(answers).forEach((id) => {
      if (relevantIds.has(id)) out[id] = answers[id];
    });
    return out;
  }

  function createBooking(input, createdAt) {
    const answers = relevantAnswers(input.categories, input.urgency, input.answers);
    const estimate = estimateForCategories(input.categories, input.urgency, answers);
    const booking = {
      id: newId("b"),
      createdAt: createdAt || new Date().toISOString(),
      status: "confirmed",
      estimateStatus: "pending",
      estimateReadyAt: null,
      urgency: input.urgency,
      categories: input.categories,
      answers,
      photoUrl: input.photoUrl || null,
      contact: input.contact,
      leadSource: input.leadSource || null,
      slotId: input.slot.id,
      slot: { id: input.slot.id, label: input.slot.label, start: input.slot.start, end: input.slot.end },
      estimate,
      symptomSummary: summarizeAnswers(answers),
      notes: extractNotes(answers),
      syncStatus: "simulated",
      syncError: null,
      sheetRowUrl: null,
      messages: {},
    };
    booking.messages = { ...buildOwnerBriefs(booking), ...buildCustomerStage1(booking) };
    return booking;
  }

  function seedHistoricalBookings() {
    DATA.seedBookings.forEach((input) => {
      const urgency = input.urgency;
      const available = getAvailableSlots(urgency);
      const slot = available[Math.floor(Math.random() * available.length)];
      if (!slot) return;
      reserveSlot(slot.id, urgency, "pending"); // placeholder id, corrected below
      const createdAt = new Date(Date.now() - input.createdAtOffsetMinutes * 60000).toISOString();
      const booking = createBooking({ ...input, slot }, createdAt);
      slot.bookingId = booking.id;
      const stage2 = buildCustomerStage2(booking);
      booking.messages = { ...booking.messages, ...stage2 };
      booking.estimateStatus = "ready";
      booking.estimateReadyAt = createdAt;
      bookings.push(booking);
    });
    bookings.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  // ---------- customer flow state ----------

  const state = {
    urgency: null,
    categories: [],
    answers: {},
    photoUrl: null,
    slotId: null,
    slot: null,
    contact: { name: "", phone: "", email: "", address: "" },
    bookingId: null,
  };
  let stepIndex = 0;

  const stepContainer = document.getElementById("step-container");
  const progressEl = document.getElementById("progress");
  const customerView = document.getElementById("customer-view");
  const adminView = document.getElementById("admin-view");
  const tabCustomer = document.getElementById("tab-customer");
  const tabAdmin = document.getElementById("tab-admin");

  function resolveCategoryQuestions(categoryId) {
    return (DATA.questions[categoryId] && DATA.questions[categoryId].default) || [];
  }

  function resolveAllQuestions(categoryIds, urgencyId) {
    const merged = [];
    categoryIds.forEach((id) => merged.push(...resolveCategoryQuestions(id)));
    if (urgencyId === "emergency") merged.push(...DATA.emergencyQuestions);
    return merged;
  }

  function renderProgress() {
    progressEl.innerHTML = "";
    const activeIndex = PROGRESS_STEPS.indexOf(STEP_ORDER[stepIndex]);
    PROGRESS_STEPS.forEach((_, i) => {
      const bar = document.createElement("div");
      bar.className = "progress-step";
      if (i < activeIndex) bar.classList.add("done");
      if (i === activeIndex) bar.classList.add("active");
      progressEl.appendChild(bar);
    });
  }

  function navRow({ backLabel, nextLabel, onBack, onNext, nextDisabled }) {
    const row = document.createElement("div");
    row.className = "nav-row";
    if (onBack) {
      const back = document.createElement("button");
      back.type = "button";
      back.className = "btn btn-secondary";
      back.textContent = backLabel || "Back";
      back.addEventListener("click", onBack);
      row.appendChild(back);
    } else {
      row.appendChild(document.createElement("span"));
    }
    const next = document.createElement("button");
    next.type = "button";
    next.className = "btn btn-primary";
    next.textContent = nextLabel || "Next";
    next.disabled = Boolean(nextDisabled);
    next.addEventListener("click", onNext);
    row.appendChild(next);
    return row;
  }

  function goTo(stepName) {
    stepIndex = STEP_ORDER.indexOf(stepName);
    renderCustomerStep();
  }

  function goBack() {
    stepIndex = Math.max(0, stepIndex - 1);
    renderCustomerStep();
  }

  // ---------- Step: Urgency ----------
  function renderUrgencyStep() {
    const wrap = document.createElement("div");
    const title = document.createElement("h2");
    title.className = "step-title";
    title.textContent = "How urgent is this?";
    const subtitle = document.createElement("p");
    subtitle.className = "step-subtitle";
    subtitle.textContent = "This helps us show you the right appointment times.";
    wrap.appendChild(title);
    wrap.appendChild(subtitle);

    const grid = document.createElement("div");
    grid.className = "option-grid";
    DATA.urgencyTiers.forEach((tier) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "option-card" + (state.urgency === tier.id ? " selected" : "");
      card.innerHTML = `<div class="opt-label">${tier.label}</div><div class="opt-desc">${tier.description}</div>`;
      card.addEventListener("click", () => {
        state.urgency = tier.id;
        renderCustomerStep();
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    wrap.appendChild(navRow({ onNext: () => goTo("category"), nextDisabled: !state.urgency }));
    stepContainer.innerHTML = "";
    stepContainer.appendChild(wrap);
  }

  // ---------- Step: Category ----------
  function renderCategoryStep() {
    const wrap = document.createElement("div");
    const title = document.createElement("h2");
    title.className = "step-title";
    title.textContent = "What's going on?";
    const subtitle = document.createElement("p");
    subtitle.className = "step-subtitle";
    subtitle.textContent = "Select all that apply - it's often more than one thing.";
    wrap.appendChild(title);
    wrap.appendChild(subtitle);

    const grid = document.createElement("div");
    grid.className = "option-grid";
    DATA.categories.forEach((cat) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "option-card" + (state.categories.includes(cat.id) ? " selected" : "");
      card.innerHTML = `<div class="opt-label">${cat.label}</div>`;
      card.addEventListener("click", () => {
        if (state.categories.includes(cat.id)) {
          state.categories = state.categories.filter((id) => id !== cat.id);
        } else {
          state.categories = [...state.categories, cat.id];
        }
        renderCustomerStep();
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    wrap.appendChild(
      navRow({ onBack: goBack, onNext: () => goTo("symptoms"), nextDisabled: state.categories.length === 0 })
    );
    stepContainer.innerHTML = "";
    stepContainer.appendChild(wrap);
  }

  // ---------- Step: Symptoms ----------
  function renderSymptomsStep() {
    const wrap = document.createElement("div");
    const title = document.createElement("h2");
    title.className = "step-title";
    title.textContent = "A few quick questions";
    wrap.appendChild(title);

    if (state.answers.nh_gas_smell === "yes") {
      const banner = document.createElement("div");
      banner.className = "safety-banner";
      banner.innerHTML =
        '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2L2 17h16L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 8v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="14.5" r="0.75" fill="currentColor"/></svg>' +
        "<span>If you smell gas right now: leave the home and call your gas utility or 911 before doing anything else. We'll still get you booked below.</span>";
      wrap.appendChild(banner);
    }

    function refreshNextButton() {
      const allQuestions = resolveAllQuestions(state.categories, state.urgency);
      const requiredMissing = allQuestions.some((q) => q.required && (state.answers[q.id] === undefined || state.answers[q.id] === ""));
      if (nextBtn) nextBtn.disabled = requiredMissing;
    }

    function renderQuestionBlock(q) {
      const block = document.createElement("div");
      block.className = "question-block";
      const label = document.createElement("label");
      label.className = "question-label";
      label.textContent = q.label;
      if (q.required) {
        const mark = document.createElement("span");
        mark.className = "required-mark";
        mark.textContent = "*";
        mark.setAttribute("aria-hidden", "true");
        label.appendChild(mark);
      }
      block.appendChild(label);

      if (q.type === "yes_no") {
        const toggle = document.createElement("div");
        toggle.className = "yes-no-toggle";
        ["yes", "no"].forEach((val) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = val === "yes" ? "Yes" : "No";
          btn.className = state.answers[q.id] === val ? "selected" : "";
          btn.addEventListener("click", () => {
            state.answers[q.id] = val;
            renderCustomerStep();
          });
          toggle.appendChild(btn);
        });
        block.appendChild(toggle);
      } else if (q.type === "single_select") {
        const select = document.createElement("select");
        const blank = document.createElement("option");
        blank.value = "";
        blank.textContent = "Select one...";
        select.appendChild(blank);
        q.options.forEach((opt) => {
          const o = document.createElement("option");
          o.value = opt;
          o.textContent = opt;
          if (state.answers[q.id] === opt) o.selected = true;
          select.appendChild(o);
        });
        select.addEventListener("change", () => {
          state.answers[q.id] = select.value;
          renderCustomerStep();
        });
        block.appendChild(select);
      } else if (q.type === "free_text") {
        const textarea = document.createElement("textarea");
        textarea.placeholder = q.required ? "Required..." : "Optional notes...";
        textarea.value = state.answers[q.id] || "";
        textarea.addEventListener("input", () => {
          state.answers[q.id] = textarea.value;
          refreshNextButton();
        });
        block.appendChild(textarea);
      }
      return block;
    }

    const categoryLookup = Object.fromEntries(DATA.categories.map((c) => [c.id, c.label]));
    state.categories.forEach((categoryId) => {
      const sectionTitle = document.createElement("h3");
      sectionTitle.className = "section-heading";
      sectionTitle.textContent = categoryLookup[categoryId] || categoryId;
      wrap.appendChild(sectionTitle);
      resolveCategoryQuestions(categoryId).forEach((q) => wrap.appendChild(renderQuestionBlock(q)));
    });

    if (state.urgency === "emergency" && DATA.emergencyQuestions.length > 0) {
      const sectionTitle = document.createElement("h3");
      sectionTitle.className = "section-heading";
      sectionTitle.textContent = "Safety check";
      wrap.appendChild(sectionTitle);
      DATA.emergencyQuestions.forEach((q) => wrap.appendChild(renderQuestionBlock(q)));
    }

    const photoBlock = document.createElement("div");
    photoBlock.className = "question-block";
    const photoLabel = document.createElement("label");
    photoLabel.className = "question-label";
    photoLabel.textContent = "Have a photo of the issue? (optional)";
    photoBlock.appendChild(photoLabel);
    const photoBtn = document.createElement("button");
    photoBtn.type = "button";
    photoBtn.className = "btn btn-secondary photo-button";
    photoBtn.innerHTML = state.photoUrl
      ? '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 9l4 4 8-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Photo attached</span>'
      : '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="2" y="4" width="14" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="9.5" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M6 4l1-1.5h4L12 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Attach a photo (demo)</span>';
    photoBtn.addEventListener("click", () => {
      state.photoUrl = state.photoUrl ? null : "demo-photo-placeholder.jpg";
      renderCustomerStep();
    });
    photoBlock.appendChild(photoBtn);
    wrap.appendChild(photoBlock);

    const allQuestions = resolveAllQuestions(state.categories, state.urgency);
    const requiredMissing = allQuestions.some((q) => q.required && (state.answers[q.id] === undefined || state.answers[q.id] === ""));
    const nav = navRow({ onBack: goBack, onNext: () => goTo("slot"), nextDisabled: requiredMissing });
    wrap.appendChild(nav);
    const nextBtn = nav.querySelector(".btn-primary");

    stepContainer.innerHTML = "";
    stepContainer.appendChild(wrap);
  }

  // ---------- Step: Slot ----------
  function renderSlotStep() {
    const slotsForUrgency = getAvailableSlots(state.urgency);

    const wrap = document.createElement("div");
    const title = document.createElement("h2");
    title.className = "step-title";
    title.textContent = "Choose a time";
    wrap.appendChild(title);

    if (state.urgency === "emergency") {
      const subtitle = document.createElement("p");
      subtitle.className = "step-subtitle";
      subtitle.textContent = "These are emergency-reserved slots, held specifically for urgent situations.";
      wrap.appendChild(subtitle);
    }

    const list = document.createElement("div");
    list.className = "slot-list";
    if (slotsForUrgency.length === 0) {
      const empty = document.createElement("div");
      empty.className = "slot-empty";
      empty.textContent = "No slots available right now - please call us directly.";
      list.appendChild(empty);
    } else {
      slotsForUrgency.forEach((slot) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "slot-card" + (state.slotId === slot.id ? " selected" : "");
        card.textContent = slot.label;
        card.addEventListener("click", () => {
          state.slotId = slot.id;
          state.slot = slot;
          renderCustomerStep();
        });
        list.appendChild(card);
      });
    }
    wrap.appendChild(list);
    wrap.appendChild(navRow({ onBack: goBack, onNext: () => goTo("contact"), nextDisabled: !state.slotId }));
    stepContainer.innerHTML = "";
    stepContainer.appendChild(wrap);
  }

  // ---------- Step: Contact ----------
  function renderContactStep() {
    const wrap = document.createElement("div");
    const title = document.createElement("h2");
    title.className = "step-title";
    title.textContent = "Almost done - your info";
    wrap.appendChild(title);

    const fields = [
      { key: "name", label: "Full name", type: "text" },
      { key: "phone", label: "Phone number", type: "tel" },
      { key: "email", label: "Email", type: "email" },
      { key: "address", label: "Service address", type: "text" },
    ];

    fields.forEach((f) => {
      const row = document.createElement("div");
      row.className = "field-row";
      const label = document.createElement("label");
      label.textContent = f.label;
      row.appendChild(label);
      const input = document.createElement("input");
      input.type = f.type;
      input.value = state.contact[f.key] || "";
      input.addEventListener("input", () => {
        state.contact[f.key] = input.value;
        nextBtn.disabled = !allContactFieldsFilled();
      });
      row.appendChild(input);
      wrap.appendChild(row);
    });

    function allContactFieldsFilled() {
      return fields.every((f) => state.contact[f.key] && state.contact[f.key].trim() !== "");
    }

    const nav = navRow({
      onBack: goBack,
      nextLabel: "Get My Estimate & Book",
      onNext: submitBooking,
      nextDisabled: !allContactFieldsFilled(),
    });
    wrap.appendChild(nav);
    const nextBtn = nav.querySelector(".btn-primary");

    stepContainer.innerHTML = "";
    stepContainer.appendChild(wrap);
  }

  // ---------- Submit + Confirmation ----------
  function submitBooking() {
    stepIndex = STEP_ORDER.indexOf("confirmation");
    renderProgress();

    const reservation = reserveSlot(state.slotId, state.urgency, "pending");
    if (!reservation.ok) {
      renderSubmitError(reservation.message);
      return;
    }

    const booking = createBooking(
      { urgency: state.urgency, categories: state.categories, answers: state.answers, photoUrl: state.photoUrl, contact: state.contact, leadSource: "demo", slot: reservation.slot },
      new Date().toISOString()
    );
    reservation.slot.bookingId = booking.id;
    state.bookingId = booking.id;
    bookings.unshift(booking);

    renderConfirmation(booking);
    scheduleStage2(booking.id);
    if (adminView && !adminView.hidden) renderAdminView();
  }

  function renderSubmitError(message) {
    const wrap = document.createElement("div");
    wrap.innerHTML = `<p class="error-text">${message}</p>`;
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "btn btn-primary";
    retry.textContent = "Try again";
    retry.addEventListener("click", () => goTo("slot"));
    wrap.appendChild(retry);
    stepContainer.innerHTML = "";
    stepContainer.appendChild(wrap);
  }

  function renderConfirmation(booking) {
    const wrap = document.createElement("div");
    wrap.className = "confirmation";
    wrap.innerHTML = `
      <div class="checkmark"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <h2 class="step-title">You're booked!</h2>
      <p class="confirmation-message">${booking.messages.customerSmsStage1}</p>
      <div class="estimate-box" id="estimate-box">
        <div class="estimate-pending"><span class="dot-pulse"></span>Preparing your ballpark estimate...</div>
      </div>
      <p class="dashboard-hint">Curious what the business owner sees the moment you book? Switch to the "Business Owner Dashboard" tab above - your ticket is already there.</p>
    `;
    stepContainer.innerHTML = "";
    stepContainer.appendChild(wrap);
  }

  function scheduleStage2(bookingId) {
    const delay = ESTIMATE_DELAY_MS_MIN + Math.random() * (ESTIMATE_DELAY_MS_MAX - ESTIMATE_DELAY_MS_MIN);
    setTimeout(() => {
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) return;
      const stage2 = buildCustomerStage2(booking);
      booking.messages = { ...booking.messages, ...stage2 };
      booking.estimateStatus = "ready";
      booking.estimateReadyAt = new Date().toISOString();

      if (state.bookingId === bookingId) {
        const box = document.getElementById("estimate-box");
        if (box) {
          box.classList.add("ready");
          box.innerHTML = `
            <div class="estimate-range">${formatMoney(booking.estimate.low)} - ${formatMoney(booking.estimate.high)} ${booking.estimate.currency}</div>
            <div class="estimate-note">${booking.estimate.note || "Final pricing confirmed at the appointment."}</div>
          `;
        }
      }
      if (adminView && !adminView.hidden) renderAdminView();
    }, delay);
  }

  function renderCustomerStep() {
    renderProgress();
    const stepName = STEP_ORDER[stepIndex];
    if (stepName === "urgency") renderUrgencyStep();
    else if (stepName === "category") renderCategoryStep();
    else if (stepName === "symptoms") renderSymptomsStep();
    else if (stepName === "slot") renderSlotStep();
    else if (stepName === "contact") renderContactStep();
  }

  // ---------- Admin dashboard (ported from admin.js) ----------

  const summaryRow = document.getElementById("summary-row");
  const slotsPanel = document.getElementById("slots-panel");
  const bookingsPanel = document.getElementById("bookings-panel");
  const expandedIds = new Set();

  function urgencyBadge(urgency) {
    return `<span class="badge badge-${urgency}">${urgency}</span>`;
  }

  function estimateBadge(booking) {
    if (booking.estimateStatus === "ready" && booking.estimate) {
      return `<span class="badge badge-ready">${formatMoney(booking.estimate.low)}-${formatMoney(booking.estimate.high)} ${booking.estimate.currency}</span>`;
    }
    return `<span class="badge badge-pending">pending</span>`;
  }

  const CHECK_ICON = '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function syncBadge(booking) {
    if (booking.syncStatus === "simulated") return `<span class="badge badge-ready">${CHECK_ICON}simulated</span>`;
    return `<span class="badge badge-pending">-</span>`;
  }

  function renderSummary(slotView) {
    const totalBookings = bookings.length;
    const pendingEstimates = bookings.filter((b) => b.estimateStatus === "pending").length;
    const cards = [
      { num: totalBookings, lbl: "Total bookings" },
      { num: pendingEstimates, lbl: "Estimates pending" },
      { num: slotView.summary.emergencyHoldsUsed + "/" + slotView.summary.emergencyHoldsTotal, lbl: "Emergency holds used today" },
      { num: slotView.summary.emergencyHoldsRemaining, lbl: "Emergency holds remaining today" },
    ];
    summaryRow.innerHTML = cards.map((c) => `<div class="summary-card"><div class="num">${c.num}</div><div class="lbl">${c.lbl}</div></div>`).join("");
  }

  function renderSlots(slotView) {
    const days = slotView.days.slice(0, 5);
    if (days.length === 0) {
      slotsPanel.innerHTML = `<div class="empty-state">No slots generated.</div>`;
      return;
    }
    slotsPanel.innerHTML = days
      .map((day) => {
        const holds = day.slots.filter((s) => s.kind === "emergency_hold");
        const chips = holds
          .map((s) => {
            const time = new Date(s.start).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
            return `<span class="slot-chip hold${s.booked ? " booked" : ""}">${time}${s.booked ? " (booked)" : ""}</span>`;
          })
          .join("");
        return `<div class="slots-day"><div class="date-label">${day.date}${day.date === slotView.today ? " (today)" : ""}</div>${chips || "<span class='slot-chip'>none</span>"}</div>`;
      })
      .join("");
  }

  function messageCard(title, body) {
    return `<div class="message-card"><h4>${title}</h4><pre>${body || "(not yet sent)"}</pre></div>`;
  }

  function renderBookings() {
    if (bookings.length === 0) {
      bookingsPanel.innerHTML = `<div class="empty-state">No bookings yet. Submit one from the Customer Booking Flow tab to see it appear here live.</div>`;
      return;
    }

    const rows = bookings
      .map((b) => {
        const expanded = expandedIds.has(b.id);
        const time = new Date(b.createdAt).toLocaleString("en-CA", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" });
        const chevron = '<svg class="row-expand-icon" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M3 1l5 4-5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        const mainRow = `
          <tr class="booking-row${expanded ? " expanded" : ""}" data-id="${b.id}" tabindex="0" aria-expanded="${expanded}">
            <td>${chevron}${time}</td>
            <td>${urgencyBadge(b.urgency)}</td>
            <td>${(b.categories || []).join(" + ")}</td>
            <td>${b.contact.name}<br><span class="cell-muted">${b.contact.phone}</span></td>
            <td>${b.slot ? b.slot.label : "-"}</td>
            <td>${b.leadSource || "direct"}</td>
            <td>${estimateBadge(b)}</td>
            <td>${b.status}</td>
            <td>${syncBadge(b)}</td>
          </tr>`;
        if (!expanded) return mainRow;
        const detail = `
          <tr class="detail-row" data-detail-for="${b.id}">
            <td colspan="9">
              <p><strong>Address:</strong> ${b.contact.address} &nbsp; | &nbsp; <strong>Email:</strong> ${b.contact.email}</p>
              <p><strong>Symptom summary:</strong> ${b.symptomSummary || "(none)"}</p>
              <p><strong>Customer notes:</strong> ${b.notes || "(none)"}</p>
              <p><strong>Photo:</strong> ${b.photoUrl || "(none provided)"}</p>
              <div class="message-grid">
                ${messageCard("Owner SMS", b.messages.ownerSms)}
                ${messageCard("Owner Email", b.messages.ownerEmail)}
                ${messageCard("Customer SMS - Stage 1", b.messages.customerSmsStage1)}
                ${messageCard("Customer Email - Stage 1", b.messages.customerEmailStage1)}
                ${messageCard("Customer SMS - Stage 2 (ballpark)", b.messages.customerSmsStage2)}
                ${messageCard("Customer Email - Stage 2 (ballpark)", b.messages.customerEmailStage2)}
              </div>
            </td>
          </tr>`;
        return mainRow + detail;
      })
      .join("");

    bookingsPanel.innerHTML = `
      <table>
        <thead>
          <tr><th>Time</th><th>Urgency</th><th>Category</th><th>Customer</th><th>Slot</th><th>Lead Source</th><th>Ballpark</th><th>Status</th><th>Sync</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;

    bookingsPanel.querySelectorAll("tr.booking-row").forEach((row) => {
      row.addEventListener("click", () => toggleRow(row));
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleRow(row);
        }
      });
    });
  }

  function toggleRow(row) {
    const id = row.getAttribute("data-id");
    if (expandedIds.has(id)) expandedIds.delete(id);
    else expandedIds.add(id);
    renderAdminView();
  }

  function renderAdminView() {
    const slotView = getAdminSlotView();
    renderSummary(slotView);
    renderSlots(slotView);
    renderBookings();
  }

  // ---------- tabs ----------

  function showCustomerView() {
    customerView.hidden = false;
    adminView.hidden = true;
    tabCustomer.classList.add("active");
    tabCustomer.setAttribute("aria-selected", "true");
    tabAdmin.classList.remove("active");
    tabAdmin.setAttribute("aria-selected", "false");
  }

  function showAdminView() {
    customerView.hidden = true;
    adminView.hidden = false;
    tabAdmin.classList.add("active");
    tabAdmin.setAttribute("aria-selected", "true");
    tabCustomer.classList.remove("active");
    tabCustomer.setAttribute("aria-selected", "false");
    renderAdminView();
  }

  tabCustomer.addEventListener("click", showCustomerView);
  tabAdmin.addEventListener("click", showAdminView);

  // ---------- restart ----------

  function resetState() {
    state.urgency = null;
    state.categories = [];
    state.answers = {};
    state.photoUrl = null;
    state.slotId = null;
    state.slot = null;
    state.contact = { name: "", phone: "", email: "", address: "" };
    state.bookingId = null;
    stepIndex = 0;
    expandedIds.clear();
  }

  function restartDemo() {
    slots = generateSlotWindow();
    seedRandomlyBooked();
    bookings = [];
    seedHistoricalBookings();
    resetState();
    showCustomerView();
    renderCustomerStep();
  }

  document.getElementById("restart-demo").addEventListener("click", restartDemo);

  // ---------- init ----------

  document.getElementById("brand-name").textContent = DATA.business.name;
  slots = generateSlotWindow();
  seedRandomlyBooked();
  seedHistoricalBookings();
  showCustomerView();
  renderCustomerStep();
})();
