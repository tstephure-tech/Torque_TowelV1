/* ==========================================================================
   Torque & Towel — booking engine
   Availability: two vans, Mon–Sat 08:00–18:00, 24h notice, 60-day horizon.
   Bookings persist in localStorage so slots stay taken between visits.
   ========================================================================== */
(function () {
  "use strict";

  var T = window.TT;
  var OPEN = 8 * 60;
  var CLOSE = 18 * 60;
  var STEP_MIN = 30;
  var CAPACITY = 2;
  var LEAD_DAYS = 1;
  var HORIZON_DAYS = 60;
  var BOOKINGS_KEY = "tt.bookings.v1";
  var DRAFT_KEY = "tt.draft.v1";

  var state = {
    step: 1, cat: "detail", serviceId: null, vehicleId: "sedan",
    addons: [], date: null, time: null,
    name: "", email: "", phone: "", address: "", notes: "", make: "", model: ""
  };

  /* ------------------------------------------------------------- helpers -- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseYmd(s) { var p = s.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function fmtTime(min) { return pad(Math.floor(min / 60)) + ":" + pad(min % 60); }
  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function fmtDate(iso) {
    var d = parseYmd(iso);
    return DOW[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()].slice(0, 3);
  }
  function fmtDateLong(iso) {
    var d = parseYmd(iso);
    return DOW[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  }
  function hoursLabel(h) {
    return (h % 1 === 0 ? h : h.toFixed(1)) + (h === 1 ? " hour" : " hours");
  }
  function hoursPhrase(h) {
    return (h % 1 === 0 ? h : h.toFixed(1)) + "-hour";
  }
  function svc() { return T.serviceById(state.serviceId); }

  /* ------------------------------------------------------------ storage -- */
  function loadBookings() {
    try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveBookings(list) {
    try { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function loadDraft() {
    try {
      var d = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null");
      if (d && d.serviceId) Object.keys(state).forEach(function (k) { if (d[k] !== undefined) state[k] = d[k]; });
    } catch (e) {}
  }
  function saveDraft() {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(state)); } catch (e) {}
  }

  /* --------------------------------------------------------- availability -- */
  function serviceSpan() {
    var s = svc();
    var days = (s && s.days) || 1;
    var hours = T.durationOf(state.serviceId, state.addons);
    return { days: days, hours: hours, minutes: Math.round(hours * 60) };
  }

  function overlaps(aStart, aEnd, bStart, bEnd) { return aStart < bEnd && bStart < aEnd; }

  /** Every booked interval that touches this date, including multi-day jobs. */
  function intervalsOn(iso) {
    var out = [];
    loadBookings().forEach(function (b) {
      var days = b.days || 1;
      for (var i = 0; i < days; i++) {
        var d = addDays(parseYmd(b.date), i);
        if (ymd(d) !== iso) continue;
        var start = i === 0 ? b.time : OPEN;
        var end = (i === days - 1 && !b.fullDay) ? Math.min(b.time + b.minutes, CLOSE) : CLOSE;
        out.push({ start: start, end: end });
      }
    });
    return out;
  }

  /**
   * Can a job of `days` days starting at startMin fit, given capacity?
   * A multi-day job occupies the rest of every day it spans.
   */
  function isFree(iso, startMin, occMin, days) {
    days = days || 1;
    if (startMin < OPEN) return false;
    if (days === 1 && startMin + occMin > CLOSE) return false;
    for (var i = 0; i < days; i++) {
      var date = ymd(addDays(parseYmd(iso), i));
      var s = i === 0 ? startMin : OPEN;
      var e = days > 1 ? CLOSE : Math.min(startMin + occMin, CLOSE);
      var taken = intervalsOn(date).filter(function (iv) { return overlaps(s, e, iv.start, iv.end); }).length;
      if (taken >= CAPACITY) return false;
    }
    return true;
  }

  /** Candidate start times for a date, honouring multi-day drop-offs. */
  function candidateStarts(span) {
    var out = [];
    if (span.days > 1) {
      for (var m = OPEN; m <= OPEN + 120; m += 60) out.push(m);
      return out;
    }
    for (var t = OPEN; t + span.minutes <= CLOSE; t += STEP_MIN) out.push(t);
    return out;
  }

  function slotsFor(iso) {
    var span = serviceSpan();
    if (!state.serviceId) return [];
    return candidateStarts(span).map(function (t) {
      return { time: t, free: isFree(iso, t, span.days > 1 ? CLOSE - OPEN : span.minutes, span.days) };
    });
  }

  function dayOpen(iso) {
    var d = parseYmd(iso);
    var min = addDays(startOfDay(new Date()), LEAD_DAYS);
    var max = addDays(startOfDay(new Date()), HORIZON_DAYS);
    if (d < min || d > max) return false;
    if (d.getDay() === 0) return false;
    return slotsFor(iso).some(function (s) { return s.free; });
  }

  /* -------------------------------------------------------------- pricing -- */
  function totals() {
    if (!state.serviceId) return { total: 0, deposit: 0, monthly: false };
    var unit = (svc() || {}).unit === "month";
    var total = T.priceOf(state.serviceId, state.vehicleId, state.addons);
    var deposit = Math.round(total * T.DEPOSIT_RATE / 5) * 5;
    return { total: total, deposit: deposit, monthly: unit };
  }

  /* ------------------------------------------------------------- renderers -- */
  var catTabs = $("#catTabs");
  var serviceList = $("#serviceList");
  var vehicleList = $("#vehicleList");
  var addonList = $("#addonList");

  function renderTabs() {
    catTabs.innerHTML = "";
    T.CATEGORIES.forEach(function (c) {
      var b = el("button", "tab", c.label);
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", c.id === state.cat ? "true" : "false");
      b.addEventListener("click", function () {
        state.cat = c.id;
        renderTabs();
        renderServices();
      });
      catTabs.appendChild(b);
    });
  }

  function priceTag(base) {
    var unit = (svc() || {}).unit === "month";
    return T.money(base) + (unit ? "<span>per month</span>" : "<span>one-off</span>");
  }

  function renderServices() {
    serviceList.innerHTML = "";
    var v = T.vehicleById(state.vehicleId);
    T.SERVICES.filter(function (s) { return s.cat === state.cat; }).forEach(function (s) {
      var price = Math.round(s.base * v.mult / 5) * 5;
      var inputId = "svc-" + s.id;
      var label = el("label", "opt");
      label.setAttribute("for", inputId);
      label.dataset.checked = state.serviceId === s.id ? "true" : "false";
      var dur = s.days ? s.days + " days" : hoursLabel(s.hours);
      label.innerHTML =
        '<input type="radio" id="' + inputId + '" name="service" value="' + s.id + '"' + (state.serviceId === s.id ? " checked" : "") + ">" +
        '<span class="opt__name">' + s.name + (s.popular ? '<span class="opt__flag">Most booked</span>' : "") + "</span>" +
        '<span class="opt__desc">' + s.desc + "</span>" +
        '<span class="opt__meta">' + dur + (s.days ? " · drop-off" : "") + "</span>" +
        '<span class="opt__price">' + T.money(price) + (s.unit === "month" ? "<span>per month</span>" : "<span>one-off</span>") + "</span>";
      label.querySelector("input").addEventListener("change", function () {
        state.serviceId = s.id;
        state.date = null;
        state.time = null;
        renderServices();
        renderSummary();
        $("#next1").disabled = false;
      });
      serviceList.appendChild(label);
    });
  }

  function renderVehicles() {
    vehicleList.innerHTML = "";
    T.VEHICLES.forEach(function (v) {
      var id = "veh-" + v.id;
      var label = el("label", "opt");
      label.setAttribute("for", id);
      label.dataset.checked = state.vehicleId === v.id ? "true" : "false";
      var from = state.serviceId ? T.money(Math.round((svc().base * v.mult) / 5) * 5) : "—";
      label.innerHTML =
        '<input type="radio" id="' + id + '" name="vehicle" value="' + v.id + '"' + (state.vehicleId === v.id ? " checked" : "") + ">" +
        '<span class="opt__name">' + v.label + "</span>" +
        '<span class="opt__desc">' + v.note + "</span>" +
        '<span class="opt__price">' + from + "<span>from</span></span>";
      label.querySelector("input").addEventListener("change", function () {
        state.vehicleId = v.id;
        renderVehicles();
        renderServices();
        renderSummary();
      });
      vehicleList.appendChild(label);
    });
  }

  function renderAddons() {
    addonList.innerHTML = "";
    T.ADDONS.forEach(function (a) {
      var id = "add-" + a.id;
      var on = state.addons.indexOf(a.id) !== -1;
      var label = el("label", "opt");
      label.setAttribute("for", id);
      label.dataset.checked = on ? "true" : "false";
      label.innerHTML =
        '<input type="checkbox" id="' + id + '" value="' + a.id + '"' + (on ? " checked" : "") + ">" +
        '<span class="opt__name">' + a.name + "</span>" +
        '<span class="opt__price">+' + T.money(a.price) + "</span>";
      label.querySelector("input").addEventListener("change", function (e) {
        if (e.target.checked) state.addons.push(a.id);
        else state.addons = state.addons.filter(function (x) { return x !== a.id; });
        label.dataset.checked = e.target.checked ? "true" : "false";
        state.date = null; state.time = null;
        renderSummary();
      });
      addonList.appendChild(label);
    });
  }

  function renderSummary() {
    var t = totals();
    $("#sumTotal").textContent = state.serviceId ? T.money(t.total) + (t.monthly ? " /mo" : "") : "$0";
    var title = $("#sumTitle");
    var rows = $("#sumRows");
    var deposit = $("#sumDeposit");

    if (!state.serviceId) {
      title.innerHTML = 'Nothing selected <em>yet.</em>';
      rows.innerHTML = "";
      deposit.textContent = "Pick a service to see the full price and deposit.";
      return;
    }

    var s = svc();
    var v = T.vehicleById(state.vehicleId);
    title.innerHTML = s.name + " <em>·</em> " + v.label;

    var html = "";
    html += '<div class="sum__row"><span>Service</span><b>' + T.money(T.priceOf(s.id, "sedan", [])) + " base</b></div>";
    html += '<div class="sum__row"><span>Vehicle</span><b>' + v.label + " ×" + v.mult.toFixed(2) + "</b></div>";
    state.addons.forEach(function (id) {
      var a = T.addonById(id);
      if (a) html += '<div class="sum__row"><span>' + a.name + "</span><b>+" + T.money(a.price) + "</b></div>";
    });
    var span = serviceSpan();
    html += '<div class="sum__row"><span>Time in the bay</span><b>' + (span.days > 1 ? span.days + " days" : hoursLabel(span.hours)) + "</b></div>";
    if (state.date) {
      html += '<div class="sum__row"><span>' + (span.days > 1 ? "Drop-off" : "Date") + "</span><b>" + fmtDate(state.date) + (state.time != null ? " · " + fmtTime(state.time) : "") + "</b></div>";
    }
    rows.innerHTML = html;
    deposit.innerHTML = "Deposit to hold your slot — <b style=\"color:var(--ink);font-weight:400\">" + T.money(t.deposit) + "</b> (20%). Balance on collection." + (t.monthly ? " Membership renews monthly; cancel with seven days' notice." : "");
    renderReview();
  }

  function renderReview() {
    var host = $("#reviewRows");
    if (!host) return;
    if (!state.serviceId) { host.innerHTML = ""; return; }
    var v = T.vehicleById(state.vehicleId);
    var span = serviceSpan();
    var rows = [
      ["Service", svc().name],
      ["Vehicle", v.label + (state.make || state.model ? " · " + [state.make, state.model].filter(Boolean).join(" ") : "")],
      ["Add-ons", state.addons.length ? state.addons.map(function (id) { return T.addonById(id).name; }).join(", ") : "None"],
      ["When", state.date ? fmtDateLong(state.date) + (state.time != null ? " at " + fmtTime(state.time) : "") : "Not chosen"],
      ["Duration", span.days > 1 ? span.days + " days (drop-off)" : hoursLabel(span.hours)],
      ["Deposit", T.money(totals().deposit)]
    ];
    host.innerHTML = rows.map(function (r) {
      return '<div class="sum__row"><span>' + r[0] + "</span><b>" + r[1] + "</b></div>";
    }).join("");
  }

  /* ------------------------------------------------------------- calendar -- */
  var calGrid = $("#calGrid");
  var calMonth = $("#calMonth");
  var slotWrap = $("#slots");
  var slotGrid = $("#slotGrid");

  var cursor = startOfDay(new Date());
  cursor.setDate(1);

  function renderCalendar() {
    calMonth.textContent = MONTHS[cursor.getMonth()] + " " + cursor.getFullYear();
    calGrid.innerHTML = "";
    DOW.forEach(function (d) {
      calGrid.appendChild(el("div", "cal__dow", d.slice(0, 2)));
    });

    var first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    var daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    var lead = first.getDay();

    for (var i = 0; i < lead; i++) calGrid.appendChild(el("div", "cal__day is-empty"));

    for (var d = 1; d <= daysInMonth; d++) {
      var dt = new Date(cursor.getFullYear(), cursor.getMonth(), d);
      var iso = ymd(dt);
      var b = el("button", "cal__day", String(d));
      b.type = "button";
      b.dataset.date = iso;
      b.setAttribute("aria-pressed", state.date === iso ? "true" : "false");
      var open = dayOpen(iso);
      if (!open) b.disabled = true;
      b.addEventListener("click", function () {
        state.date = this.dataset.date;
        state.time = null;
        renderCalendar();
        renderSlots();
        renderSummary();
      });
      calGrid.appendChild(b);
    }

    var today = startOfDay(new Date());
    var minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    var maxMonth = addDays(today, HORIZON_DAYS);
    $("#calPrev").disabled = cursor <= minMonth;
    $("#calNext").disabled = new Date(cursor.getFullYear(), cursor.getMonth(), 1) >= new Date(maxMonth.getFullYear(), maxMonth.getMonth(), 1);
  }

  function renderSlots() {
    var span = serviceSpan();
    if (!state.date) { slotWrap.hidden = true; return; }
    slotWrap.hidden = false;
    $("#slotsTitle").textContent = (span.days > 1 ? "Drop-off time · " + fmtDate(state.date) : "Start times · " + fmtDate(state.date));
    slotGrid.innerHTML = "";
    var list = slotsFor(state.date);
    if (!list.length) {
      slotGrid.appendChild(el("p", "slots__empty", "That service does not fit in a working day here. Choose a shorter service or another date."));
      return;
    }
    var any = false;
    list.forEach(function (s) {
      var b = el("button", "slot", fmtTime(s.time));
      b.type = "button";
      b.setAttribute("aria-pressed", state.time === s.time ? "true" : "false");
      if (!s.free) { b.disabled = true; b.title = "Fully booked"; }
      else any = true;
      b.addEventListener("click", function () {
        state.time = s.time;
        renderSlots();
        renderSummary();
        $("#next3").disabled = false;
      });
      slotGrid.appendChild(b);
    });
    if (!any) slotGrid.appendChild(el("p", "slots__empty", "All of those times are taken. Try the next day."));
    var end = state.time != null ? Math.min(state.time + span.minutes, CLOSE) : null;
    $("#timeHint").textContent = (span.days > 1
      ? "This is a " + span.days + "-day drop-off — we keep the car. "
      : "This is a " + hoursPhrase(span.hours) + " booking. ") +
      (end ? "You would be with us until " + fmtTime(end) + "." : "Pick a start time that fits before 18:00.");
  }

  /* ----------------------------------------------------------------- steps -- */
  function setStep(n) {
    state.step = n;
    document.querySelectorAll(".step").forEach(function (s) {
      var on = Number(s.dataset.step) === n;
      s.classList.toggle("is-active", on);
      s.hidden = !on;
    });
    document.querySelectorAll("#stepsNav li").forEach(function (li) {
      var k = Number(li.dataset.step);
      li.dataset.current = k === n ? "true" : "false";
      li.dataset.done = k < n ? "true" : "false";
    });
    if (n === 3) { renderCalendar(); renderSlots(); }
    if (n === 4) { renderReview(); }
    saveDraft();
    var top = $(".bk").getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  /* ------------------------------------------------------------ validation -- */
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function validPhone(v) { return (v.replace(/[^\d]/g, "").length >= 7); }

  function markField(id, ok) {
    var f = $("#" + id).closest(".field");
    if (f) f.dataset.invalid = ok ? "false" : "true";
    return ok;
  }

  /* --------------------------------------------------------------- wiring -- */
  renderTabs();
  renderServices();
  renderVehicles();
  renderAddons();
  loadDraft();

  if (state.serviceId) {
    var active = T.serviceById(state.serviceId);
    if (active) {
      $("#next1").disabled = false;
      state.cat = active.cat;
    } else {
      state.serviceId = null;
      state.cat = "detail";
    }
    renderTabs();
    renderServices();
    renderVehicles();
  }
  renderSummary();

  $("#next1").addEventListener("click", function () { if (state.serviceId) setStep(2); });
  $("#next2").addEventListener("click", function () {
    state.make = $("#make").value.trim();
    state.model = $("#model").value.trim();
    renderReview();
    setStep(3);
  });
  $("#next3").addEventListener("click", function () {
    if (state.date && state.time != null) setStep(4);
  });
  document.querySelectorAll("[data-back]").forEach(function (b) {
    b.addEventListener("click", function () { setStep(Number(b.dataset.back)); });
  });

  $("#calPrev").addEventListener("click", function () {
    cursor.setMonth(cursor.getMonth() - 1);
    renderCalendar();
  });
  $("#calNext").addEventListener("click", function () {
    cursor.setMonth(cursor.getMonth() + 1);
    renderCalendar();
  });

  var form = $("#bookForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    state.name = $("#name").value.trim();
    state.email = $("#email").value.trim();
    state.phone = $("#phone").value.trim();
    state.address = $("#address").value.trim();
    state.notes = $("#notes").value.trim();
    state.make = $("#make").value.trim();
    state.model = $("#model").value.trim();

    var ok = true;
    ok = markField("name", state.name.length >= 2) && ok;
    ok = markField("email", validEmail(state.email)) && ok;
    ok = markField("phone", validPhone(state.phone)) && ok;
    ok = markField("address", state.address.length >= 5) && ok;

    if (!ok) {
      var firstBad = document.querySelector('.field[data-invalid="true"] input, .field[data-invalid="true"] textarea');
      if (firstBad) firstBad.focus();
      return;
    }
    if (!state.date || state.time == null || !state.serviceId) { setStep(3); return; }

    // last-moment availability check
    var span = serviceSpan();
    if (!isFree(state.date, state.time, span.days > 1 ? CLOSE - OPEN : span.minutes, span.days)) {
      state.time = null;
      setStep(3);
      renderSlots();
      $("#timeHint").textContent = "That slot went while you were filling in the form. Pick another.";
      return;
    }

    submitBooking();
  });

  /* ------------------------------------------------------------- confirm -- */
  function makeRef() {
    var d = new Date();
    var alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var tail = "";
    var buf = new Uint8Array(4);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(buf);
    else for (var k = 0; k < 4; k++) buf[k] = Math.floor(Math.random() * 256);
    for (var i = 0; i < 4; i++) tail += alphabet[buf[i] % alphabet.length];
    return "TT-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + tail;
  }

  var lastBooking = null;

  function submitBooking() {
    var s = svc();
    var v = T.vehicleById(state.vehicleId);
    var span = serviceSpan();
    var t = totals();
    var booking = {
      ref: makeRef(),
      created: new Date().toISOString(),
      serviceId: s.id,
      serviceName: s.name,
      vehicleId: v.id,
      vehicleName: v.label,
      make: state.make,
      model: state.model,
      addons: state.addons.map(function (id) {
        var a = T.addonById(id);
        return { id: a.id, name: a.name, price: a.price };
      }),
      date: state.date,
      time: state.time,
      minutes: span.minutes,
      hours: span.hours,
      days: span.days,
      fullDay: span.days > 1,
      total: t.total,
      deposit: t.deposit,
      monthly: t.monthly,
      name: state.name,
      email: state.email,
      phone: state.phone,
      address: state.address,
      notes: state.notes
    };

    var list = loadBookings();
    list.push(booking);
    saveBookings(list);
    lastBooking = booking;

    // confirmation view
    $("#bkGrid").hidden = true;
    var c = $("#confirm");
    c.hidden = false;
    $("#confirmLead").innerHTML = "We have you down for <em>" + s.name + "</em> on " +
      fmtDateLong(booking.date) + " at " + fmtTime(booking.time) + ". A confirmation is on its way to " + booking.email + ".";
    $("#confirmRef").textContent = booking.ref;
    $("#confirmRows").innerHTML = [
      ["Service", s.name],
      ["Vehicle", v.label + (booking.make || booking.model ? " · " + [booking.make, booking.model].filter(Boolean).join(" ") : "")],
      ["Add-ons", booking.addons.length ? booking.addons.map(function (a) { return a.name; }).join(", ") : "None"],
      ["Drop-off", fmtDateLong(booking.date) + " at " + fmtTime(booking.time)],
      ["Collection", collectionLabel(booking)],
      ["Total", T.money(booking.total) + (booking.monthly ? " / month" : "")],
      ["Deposit due", T.money(booking.deposit)],
      ["Where", booking.address]
    ].map(function (r) { return "<div><span>" + r[0] + "</span><b>" + r[1] + "</b></div>"; }).join("");

    try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function collectionLabel(b) {
    if (b.days > 1) {
      var d = addDays(parseYmd(b.date), b.days - 1);
      return fmtDateLong(ymd(d)) + " at 17:00";
    }
    var end = Math.min(b.time + b.minutes, CLOSE);
    return fmtDateLong(b.date) + " at " + fmtTime(end);
  }

  $("#bookAnother").addEventListener("click", function () {
    try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) {}
    window.location.reload();
  });

  /* ----------------------------------------------------------------- ICS -- */
  function icsStamp(iso, minutes) {
    var d = parseYmd(iso);
    return "" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(Math.floor(minutes / 60)) + pad(minutes % 60) + "00";
  }

  $("#downloadIcs").addEventListener("click", function () {
    if (!lastBooking) return;
    var b = lastBooking;
    var startMin = b.time;
    var endMin = b.days > 1 ? CLOSE : Math.min(b.time + b.minutes, CLOSE);
    var endDate = b.days > 1 ? ymd(addDays(parseYmd(b.date), b.days - 1)) : b.date;
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Torque and Towel//Booking//EN",
      "BEGIN:VEVENT",
      "UID:" + b.ref + "@torqueandtowel.com",
      "DTSTAMP:" + icsStamp(ymd(new Date()), 0),
      "DTSTART:" + icsStamp(b.date, startMin),
      "DTEND:" + icsStamp(endDate, endMin),
      "SUMMARY:" + "Torque & Towel — " + b.serviceName,
      "LOCATION:" + b.address.replace(/,/g, "\\,"),
      "DESCRIPTION:" + ("Ref " + b.ref + " · " + b.vehicleName + " · deposit " + T.money(b.deposit)),
      "END:VEVENT",
      "END:VCALENDAR"
    ];
    var blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = b.ref + ".ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });
})();
