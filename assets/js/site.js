(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* translucent header: the soft edge appears only once content is under it */
  const header = $(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 4);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
  }

  /* mobile menu (labels come from the button, so they follow the page language) */
  const btn = $("#menu-btn");
  const panel = $("#mobile-nav");
  if (btn && panel) {
    const setOpen = (open) => {
      btn.setAttribute("aria-expanded", String(open));
      btn.querySelector("[data-label]").textContent = open ? btn.dataset.close || "Close" : btn.dataset.open || "Menu";
      panel.hidden = !open;
    };
    btn.addEventListener("click", () => setOpen(panel.hidden));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { setOpen(false); btn.focus(); } });
    matchMedia("(min-width: 1180px)").addEventListener("change", (m) => { if (m.matches) setOpen(false); });
  }

  /* services dropdown: opens on hover with a mouse, on press with touch or keyboard,
     and grows out of its trigger (see .nav-menu transform-origin) */
  $$("[data-drop]").forEach((drop) => {
    const toggle = $("button", drop);
    const set = (open) => { open ? drop.setAttribute("data-open", "") : drop.removeAttribute("data-open"); toggle.setAttribute("aria-expanded", String(open)); };
    let timer;
    drop.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { clearTimeout(timer); set(true); } });
    drop.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") timer = setTimeout(() => set(false), 120); });
    toggle.addEventListener("click", () => set(!drop.hasAttribute("data-open")));
    drop.addEventListener("keydown", (e) => { if (e.key === "Escape") { set(false); toggle.focus(); } });
    drop.addEventListener("focusout", (e) => { if (!drop.contains(e.relatedTarget)) set(false); });
    document.addEventListener("pointerdown", (e) => { if (!drop.contains(e.target)) set(false); });
  });

  /* forms: submit to Netlify Forms, fall back to the visitor's email app if that fails.
     Status messages come from data-msg-* on the form, so they match the page language. */
  const wireForm = (form, note, subjectPrefix) => {
    if (!form) return;
    const submit = $("button[type=submit]", form);
    const msg = form.dataset;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const d = new FormData(form);
      if (submit) submit.disabled = true;
      if (note) note.textContent = msg.msgSending || "Sending…";
      try {
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(d).toString(),
        });
        if (!res.ok) throw new Error("status " + res.status);
        form.reset();
        if (note) note.textContent = msg.msgOk || "Thanks, we've got your message.";
      } catch (err) {
        const lines = [];
        d.forEach((v, k) => { if (k !== "form-name" && k !== "bot-field" && String(v).trim()) lines.push(k + ": " + v); });
        if (note) note.textContent = msg.msgFail || "We couldn't send that automatically, so your email app is opening instead.";
        location.href = "mailto:info@nabnatech.com?subject=" + encodeURIComponent(subjectPrefix + (d.get("name") || "")) + "&body=" + encodeURIComponent(lines.join("\n"));
      } finally {
        setTimeout(() => { if (submit) submit.disabled = false; }, 2500);
      }
    });
  };
  wireForm($("#contact-form"), $("#form-note"), "New project inquiry from ");
  wireForm($("#finder-form"), $("#finder-note"), "7-Day Revenue Finder application from ");
  wireForm($("#pilot-form"), $("#pilot-note"), "WhatsApp assistant pilot request from ");

  /* home hero slider: autoplay with a visible progress bar and a pause control; tabs
     respond on press; a swipe reads intent from its velocity, projected forward like a
     flick, so a short fast swipe counts as much as a long slow one. */
  const hero = $("#hero");
  if (hero) {
    const slides = $$(".slide", hero), tabs = $$(".tab", hero);
    const now = $("[data-now]", hero), tagText = $("[data-tag-text]", hero), pauseBtn = $("[data-pause]", hero);
    const rtl = document.documentElement.dir === "rtl";
    const DUR = 6500;
    let i = 0, timer, paused = reduce, seen = true;
    hero.style.setProperty("--dur", DUR + "ms");
    const schedule = () => { clearTimeout(timer); if (!paused && seen) timer = setTimeout(() => show(i + 1), DUR); };
    const show = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { s.classList.toggle("is-on", k === i); s.setAttribute("aria-hidden", String(k !== i)); });
      tabs.forEach((t, k) => { t.setAttribute("aria-selected", String(k === i)); const bar = $("i", t); bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; });
      now.textContent = String(i + 1).padStart(2, "0");
      tagText.textContent = slides[i].dataset.tag;
      schedule();
    };
    const setPaused = (p) => {
      paused = p;
      hero.classList.toggle("is-paused", p);
      pauseBtn.setAttribute("aria-label", p ? pauseBtn.dataset.labelPlay : pauseBtn.dataset.labelPause);
      schedule();
    };
    if (reduce) hero.classList.add("is-paused");
    tabs.forEach((t, k) => {
      t.addEventListener("pointerdown", () => show(k));
      t.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(k); } });
    });
    $("[data-next]", hero).addEventListener("click", () => show(i + 1));
    $("[data-prev]", hero).addEventListener("click", () => show(i - 1));
    pauseBtn.addEventListener("click", () => setPaused(!paused));
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; schedule(); }).observe(hero);
    document.addEventListener("visibilitychange", () => { seen = !document.hidden; schedule(); });
    const project = (v, d = 0.998) => (v / 1000) * d / (1 - d);
    let drag = null;
    hero.addEventListener("pointerdown", (e) => { if (e.target.closest(".tabs, a, button")) return; drag = { x: e.clientX, hist: [[e.clientX, e.timeStamp]] }; });
    hero.addEventListener("pointermove", (e) => { if (!drag) return; drag.hist.push([e.clientX, e.timeStamp]); if (drag.hist.length > 5) drag.hist.shift(); });
    hero.addEventListener("pointerup", (e) => {
      if (!drag) return;
      const h = drag.hist, a = h[0], b = h[h.length - 1];
      const v = (b[0] - a[0]) / Math.max(1, b[1] - a[1]) * 1000;
      const travel = (e.clientX - drag.x) + project(v);
      drag = null;
      if (Math.abs(travel) > Math.min(160, innerWidth * .18)) show(i + ((travel < 0) !== rtl ? 1 : -1));
    });
    hero.addEventListener("pointercancel", () => (drag = null));
    hero.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") show(i + (rtl ? -1 : 1));
      if (e.key === "ArrowLeft") show(i + (rtl ? 1 : -1));
    });
    schedule();

    /* on phones the floating WhatsApp button would cover the hero's buttons and
       controls, so it waits until the hero has scrolled away */
    const wa = $(".wa-pill");
    if (wa) new IntersectionObserver(([e]) => wa.classList.toggle("is-hidden", e.isIntersecting), { threshold: 0.15 }).observe(hero);
  }

  /* "what's your next move" picker: changes on press; up and down arrows move between goals */
  $$("[data-mover]").forEach((mover) => {
    const picks = $$(".pick", mover), views = $$(".view", mover);
    const pick = (k) => {
      picks.forEach((p, j) => { p.setAttribute("aria-selected", String(j === k)); p.tabIndex = j === k ? 0 : -1; });
      views.forEach((v, j) => v.classList.toggle("is-on", j === k));
    };
    picks.forEach((p, k) => {
      p.addEventListener("pointerdown", () => pick(k));
      p.addEventListener("click", () => pick(k));
      p.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        const n = (k + d + picks.length) % picks.length;
        pick(n);
        picks[n].focus();
      });
    });
    pick(0);
  });

  /* slogan marquee only runs while it is on screen */
  const closing = $("#closing");
  if (closing) new IntersectionObserver(([e]) => closing.classList.toggle("is-off", !e.isIntersecting)).observe(closing);

  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
