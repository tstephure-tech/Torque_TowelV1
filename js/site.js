/* ==========================================================================
   Torque & Towel — site behaviour
   Reveals, header state, menu, hero film control, pinned process sequence.
   ========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------- reveals -- */
  var revealables = [].slice.call(document.querySelectorAll("[data-reveal], [data-lines]"));

  if (!("IntersectionObserver" in window) || reduce) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------------- header -- */
  var siteHeader = document.getElementById("siteHeader");
  var wordmark = document.getElementById("wordmark");
  var hero = document.querySelector(".hero");

  function syncHeader() {
    var past = window.scrollY > (hero ? hero.offsetHeight - 96 : 400);
    if (siteHeader) siteHeader.classList.toggle("is-scrolled", past);
    if (wordmark) wordmark.classList.toggle("is-on", past);
  }
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  /* ---------------------------------------------------------------- menu -- */
  var menu = document.getElementById("menu");
  var menuOpen = document.getElementById("menuOpen");
  var menuClose = document.getElementById("menuClose");
  var lastFocus = null;

  function openMenu() {
    if (!menu) return;
    lastFocus = document.activeElement;
    menu.dataset.open = "true";
    menuOpen.setAttribute("aria-expanded", "true");
    document.body.dataset.menu = "open";
    var first = menu.querySelector(".menu__link");
    if (first) first.focus({ preventScroll: true });
  }
  function closeMenu() {
    if (!menu) return;
    menu.dataset.open = "false";
    menuOpen.setAttribute("aria-expanded", "false");
    delete document.body.dataset.menu;
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  if (menuOpen) menuOpen.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (menu) {
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.dataset.open === "true") closeMenu();
      if (e.key === "Tab" && menu.dataset.open === "true") {
        var f = menu.querySelectorAll('a[href], button:not([disabled])');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ----------------------------------------------------------- hero film -- */
  var video = document.getElementById("heroVideo");
  var pauseBtn = document.getElementById("heroPause");

  if (video && pauseBtn) {
    var label = pauseBtn.querySelector("span");
    function setPaused(paused) {
      pauseBtn.dataset.paused = paused ? "true" : "false";
      pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      if (label) label.textContent = paused ? "Play film" : "Pause film";
    }
    if (reduce) {
      video.removeAttribute("autoplay");
      video.pause();
      setPaused(true);
    }
    pauseBtn.addEventListener("click", function () {
      if (video.paused) { video.play().catch(function () {}); setPaused(false); }
      else { video.pause(); setPaused(true); }
    });
    video.addEventListener("play", function () { setPaused(false); });
    video.addEventListener("pause", function () { setPaused(true); });
  }

  /* ------------------------------------------------------ pinned process -- */
  var pinSection = document.querySelector(".act--pin");
  var pin = document.getElementById("pin");

  if (pinSection && pin && !reduce) {
    var stages = [].slice.call(pin.querySelectorAll(".pin__stage"));
    var dots = [].slice.call(pin.querySelectorAll(".pin__dot"));
    var count = pin.querySelector(".pin__count b");
    var current = 0;
    var ticking = false;

    function setStage(i) {
      current = i;
      stages.forEach(function (s, k) {
        s.dataset.active = k === i ? "true" : "false";
        if (k === i) s.removeAttribute("aria-hidden");
        else s.setAttribute("aria-hidden", "true");
      });
      dots.forEach(function (d, k) {
        d.dataset.active = k === i ? "true" : "false";
        d.setAttribute("aria-selected", k === i ? "true" : "false");
      });
      if (count) count.textContent = ("0" + (i + 1)).slice(-2);
    }

    function update() {
      ticking = false;
      var rect = pinSection.getBoundingClientRect();
      var scrollable = pinSection.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      var p = Math.min(1, Math.max(0, -rect.top / scrollable));
      var idx = Math.min(2, Math.floor(p * 2.999));
      if (idx !== current) setStage(idx);
    }
    function request() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        var scrollable = pinSection.offsetHeight - window.innerHeight;
        var top = pinSection.offsetTop + scrollable * ((i + 0.5) / 3);
        window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
      });
    });
  }

  /* ----------------------------------------------------------- newsletter -- */
  var form = document.getElementById("newsletter");
  var note = document.getElementById("newsletterNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input");
      var value = (input.value || "").trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      if (!note) return;
      if (!ok) {
        note.textContent = "That address does not look right.";
        input.focus();
        return;
      }
      note.textContent = "On the list. We send one note a month.";
      form.reset();
    });
  }
})();
