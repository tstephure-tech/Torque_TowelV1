/* ==========================================================================
   Torque & Towel — service catalog & pricing model
   Prices are USD, quoted at the Coupe/Sedan class and scaled by vehicle class.
   Ranges are a US market scan (see DESIGN.md §6 and the on-page scan table).
   ========================================================================== */
(function () {
  "use strict";

  var VEHICLES = [
    { id: "sedan", label: "Coupe / Sedan", note: "2-door, 4-door, wagon", mult: 1.0 },
    { id: "suv", label: "SUV / Truck", note: "Crossover, pickup, 3-row", mult: 1.18 },
    { id: "xl", label: "XL / Van", note: "Sprinter, ESV, long wheelbase", mult: 1.34 }
  ];

  var CATEGORIES = [
    { id: "detail", label: "Detailing", blurb: "Wash, decontaminate, reset the interior." },
    { id: "correction", label: "Correction", blurb: "Machine polishing that removes defects, not paint." },
    { id: "membership", label: "Membership", blurb: "The car stays clean without you booking it." }
  ];

  var SERVICES = [
    /* ---------------------------------------------------------- detailing */
    {
      id: "signature", cat: "detail", name: "The Signature Detail", base: 349,
      hours: 4.5, tag: "Baseline",
      desc: "Decontamination wash, clay, one machine pass on the high-touch panels, full interior reset and a six-month sealant."
    },
    {
      id: "interior", cat: "detail", name: "Interior Restoration", base: 279,
      hours: 4,
      desc: "Steam extraction on seats and carpet, leather cleaned and fed, vents pulled, glass polished, ozone finish."
    },
    {
      id: "maintenance", cat: "detail", name: "Maintenance Wash", base: 129,
      hours: 2,
      desc: "Our two-bucket hand wash, wheels and arches, glass and a wipe-down. For cars already on the programme."
    },

    /* --------------------------------------------------------- correction */
    {
      id: "scratch", cat: "correction", name: "Scratch & Defect Removal", base: 189,
      hours: 2, popular: true,
      desc: "One panel, measured before and after with a paint-depth gauge. Wet-sanded, machine corrected, blended and sealed."
    },
    {
      id: "stage1", cat: "correction", name: "Single-Stage Correction", base: 549,
      hours: 8,
      desc: "Removes 70–85% of swirls and wash marks. One day in the bay, one written record of what came out."
    },
    {
      id: "stage2", cat: "correction", name: "Two-Stage Correction", base: 949,
      hours: 12, days: 2,
      desc: "Full defect removal — sanding marks, holograms, deep scratches. Two days, both measured."
    },

    /* --------------------------------------------------------- membership */
    {
      id: "rinse", cat: "membership", name: "The Rinse", base: 129,
      hours: 2, unit: "month",
      desc: "Two maintenance washes a month, interior reset, glass in and out. Cancel with seven days' notice."
    },
    {
      id: "standard", cat: "membership", name: "The Standard", base: 279,
      hours: 2, unit: "month", popular: true,
      desc: "Weekly wash, monthly interior, quarterly decontamination and sealant. The default for daily drivers."
    },
    {
      id: "concours", cat: "membership", name: "The Concours", base: 549,
      hours: 2, unit: "month",
      desc: "Weekly wash, monthly Signature Detail, annual correction and coating top-up, with priority slots."
    }
  ];

  var ADDONS = [
    { id: "pet", name: "Pet hair removal", price: 65, hours: 0.5 },
    { id: "engine", name: "Engine bay detail", price: 79, hours: 0.5 },
    { id: "ozone", name: "Ozone / odour treatment", price: 89, hours: 1 },
    { id: "headlights", name: "Headlight restoration", price: 99, hours: 1 },
    { id: "wheelsOff", name: "Wheels-off deep clean", price: 149, hours: 2 },
    { id: "ppf", name: "PPF — front bumper", price: 549, hours: 4 }
  ];

  /* Market scan — published US ranges for comparable services, 2025. */
  var SCAN = [
    { label: "Full detail", low: 200, high: 500, ours: 349 },
    { label: "Paint correction", low: 400, high: 1200, ours: 549 },
    { label: "Ceramic coating", low: 700, high: 2500, ours: 899 },
    { label: "Full colour wrap", low: 3000, high: 6500, ours: 3650 },
    { label: "Full vehicle tint", low: 250, high: 600, ours: 349 },
    { label: "Monthly membership", low: 80, high: 400, ours: 129 }
  ];

  var DEPOSIT_RATE = 0.2;

  function serviceById(id) {
    for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) return SERVICES[i];
    return null;
  }
  function vehicleById(id) {
    for (var i = 0; i < VEHICLES.length; i++) if (VEHICLES[i].id === id) return VEHICLES[i];
    return VEHICLES[0];
  }
  function addonById(id) {
    for (var i = 0; i < ADDONS.length; i++) if (ADDONS[i].id === id) return ADDONS[i];
    return null;
  }
  function roundTo5(n) { return Math.round(n / 5) * 5; }

  function scaled(base, mult, factor) {
    /* the quoted base is the price; class scaling is rounded to the nearest $5 */
    return mult === 1 ? base : roundTo5(base * mult * (factor || 1));
  }

  function priceOf(serviceId, vehicleId, addonIds) {
    var s = serviceById(serviceId);
    if (!s) return 0;
    var v = vehicleById(vehicleId);
    var total = scaled(s.base, v.mult);
    (addonIds || []).forEach(function (id) {
      var a = addonById(id);
      if (a) total += scaled(a.price, v.mult, 0.5 + 0.5 / v.mult);
    });
    return total;
  }

  function durationOf(serviceId, addonIds) {
    var s = serviceById(serviceId);
    var h = s ? s.hours : 2;
    (addonIds || []).forEach(function (id) {
      var a = addonById(id);
      if (a) h += a.hours;
    });
    return h;
  }

  function money(n) {
    return "$" + n.toLocaleString("en-US");
  }

  window.TT = {
    VEHICLES: VEHICLES,
    CATEGORIES: CATEGORIES,
    SERVICES: SERVICES,
    ADDONS: ADDONS,
    SCAN: SCAN,
    DEPOSIT_RATE: DEPOSIT_RATE,
    serviceById: serviceById,
    vehicleById: vehicleById,
    addonById: addonById,
    priceOf: priceOf,
    durationOf: durationOf,
    money: money
  };
})();
