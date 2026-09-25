/* Bunyan Digital — site behaviour.
   Motion stack: GSAP + ScrollTrigger, with Lenis as the ONLY smooth-scroll engine.
   Everything below degrades: no GSAP -> content simply shows; reduced motion -> final states, no Lenis. */
(() => {
  "use strict";

  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const ac = new AbortController();
  const on = (target, type, fn, opts = {}) => target && target.addEventListener(type, fn, { ...opts, signal: ac.signal });

  let lenis = null;

  /* ---------------------------------------------------------------- header */
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 24);
  on(window, "scroll", onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------- mobile menu */
  const menuBtn = $("#menu-btn");
  const menu = $("#mobile-menu");
  if (menuBtn && menu) {
    const focusables = () => $$("a[href], button:not([disabled])", menu);
    const setOpen = (open) => {
      menu.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (lenis) open ? lenis.stop() : lenis.start();
      if (open) {
        window.setTimeout(() => focusables()[0] && focusables()[0].focus(), 60);
      } else {
        menuBtn.focus({ preventScroll: true });
      }
    };
    on(menuBtn, "click", () => setOpen(!menu.classList.contains("is-open")));
    $$("[data-menu-close]", menu).forEach((el) => on(el, "click", () => setOpen(false)));
    $$("a", menu).forEach((a) => on(a, "click", () => menu.classList.contains("is-open") && setOpen(false)));
    on(document, "keydown", (e) => {
      if (!menu.classList.contains("is-open")) return;
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    on(window, "resize", () => window.innerWidth >= 1280 && menu.classList.contains("is-open") && setOpen(false));
  }

  /* ------------------------------------------------------------- accordion */
  const items = $$("[data-index-item]");
  const refreshSoon = (() => {
    let t = 0;
    return () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => window.ScrollTrigger && window.ScrollTrigger.refresh(), 620);
    };
  })();
  items.forEach((item, i) => {
    const btn = $(".index-btn", item);
    const panel = $(".index-panel", item);
    if (!btn || !panel) return;
    const set = (open) => {
      btn.setAttribute("aria-expanded", String(open));
      if (open) panel.removeAttribute("data-closed"); else panel.setAttribute("data-closed", "");
      panel.inert = !open;
      refreshSoon();
    };
    set(i === 0);
    on(btn, "click", () => {
      const willOpen = btn.getAttribute("aria-expanded") !== "true";
      items.forEach((other) => {
        const b = $(".index-btn", other);
        const p = $(".index-panel", other);
        if (b !== btn && b.getAttribute("aria-expanded") === "true") {
          b.setAttribute("aria-expanded", "false"); p.setAttribute("data-closed", ""); p.inert = true;
        }
      });
      set(willOpen);
    });
  });

  /* ---------------------------------------------------------------- forms */
  /* Submitted to Netlify Forms (shows up in the Netlify dashboard / notification email).
     If the request fails (offline, local preview) it falls back to opening the visitor's email app. */
  const wireForm = (form, note, subjectPrefix, okMessage) => {
    if (!form) return;
    const submit = $("button[type=submit]", form);
    on(form, "submit", async (e) => {
      e.preventDefault();
      const d = new FormData(form);
      if (submit) submit.disabled = true;
      if (note) note.textContent = "Sending…";
      try {
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(d).toString(),
        });
        if (!res.ok) throw new Error("status " + res.status);
        form.reset();
        if (note) note.textContent = okMessage;
      } catch (err) {
        const lines = [];
        d.forEach((v, k) => { if (k !== "form-name" && k !== "bot-field" && String(v).trim()) lines.push(k + ": " + v); });
        const subject = encodeURIComponent(subjectPrefix + (d.get("name") || ""));
        if (note) note.textContent = "We couldn't send that automatically — opening your email app instead. Or email us at info@bunyandigital.co.";
        window.location.href = "mailto:info@bunyandigital.co?subject=" + subject + "&body=" + encodeURIComponent(lines.join("\n"));
      } finally {
        window.setTimeout(() => { if (submit) submit.disabled = false; }, 2500);
      }
    });
  };
  wireForm($("#contact-form"), $("#form-note"), "New project inquiry from ", "Thanks — we've got your message and will reply within one business day.");
  wireForm($("#finder-form"), $("#finder-note"), "7-Day Revenue Finder application from ", "Thanks — your application is in. We'll confirm whether you qualify within one business day.");
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------------------------------------------------------------- motion */
  const { gsap, ScrollTrigger } = window;
  if (reduced) { root.classList.add("reduced"); window.__siteReady = true; return; }
  if (!gsap || !ScrollTrigger) { root.classList.remove("js"); window.__siteReady = true; return; }

  gsap.registerPlugin(ScrollTrigger);
  window.__siteReady = true;

  /* one smooth-scroll engine: Lenis, driven by GSAP's ticker so ScrollTrigger stays in sync */
  let tick = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95 });
    lenis.on("scroll", ScrollTrigger.update);
    tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      on(a, "click", (e) => {
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -(header ? header.offsetHeight : 0) - 12 });
      });
    });
  }

  /* accessible word split: the heading keeps its full text as an aria-label,
     decorative word spans are aria-hidden; only plain text and span.acc are supported. */
  const splitWords = (el) => {
    const label = el.textContent.replace(/\s+/g, " ").trim();
    const frag = document.createDocumentFragment();
    const addWords = (text, cls) => {
      text.split(/\s+/).filter(Boolean).forEach((word) => {
        const outer = document.createElement("span");
        outer.className = "w" + (cls ? " " + cls : "");
        outer.setAttribute("aria-hidden", "true");
        const inner = document.createElement("span");
        inner.className = "wi";
        inner.textContent = word;
        outer.appendChild(inner);
        frag.appendChild(outer);
        frag.appendChild(document.createTextNode(" "));
      });
    };
    el.childNodes.forEach((node) => {
      if (node.nodeType === 3) addWords(node.textContent, "");
      else if (node.nodeType === 1) addWords(node.textContent, node.className);
    });
    el.setAttribute("aria-label", label);
    el.textContent = "";
    el.appendChild(frag);
    el.classList.add("is-split");
    return $$(".wi", el);
  };

  const ctx = gsap.context(() => {
    const hero = $(".hero");
    const heroTitle = hero && $("[data-split]", hero);
    const scrubWords = [];

    $$("[data-split]").forEach((el) => {
      const words = splitWords(el);
      if (el.closest("[data-scrub-words]")) {
        gsap.set(words, { opacity: 0.16, yPercent: 0 });
        scrubWords.push({ el, words });
        return;
      }
      gsap.set(words, { yPercent: 112 });
      if (hero && hero.contains(el)) return; // played by the hero intro below
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: () => gsap.to(words, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.055 }),
      });
    });

    scrubWords.forEach(({ el, words }) => {
      gsap.to(words, {
        opacity: 1, ease: "none", stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 52%", scrub: 0.6 },
      });
    });

    /* hero intro: navigation + message + CTA are usable from the first frame; motion is additive */
    if (hero) {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.1 });
      if (header) tl.from(header, { yPercent: -30, opacity: 0, duration: 0.9 }, 0);
      const arabic = $(".hero-arabic", hero);
      if (arabic) tl.from(arabic, { opacity: 0, scale: 1.05, transformOrigin: "80% 80%", duration: 1.8, ease: "power3.out" }, 0);
      if (heroTitle) tl.to($$(".wi", heroTitle), { yPercent: 0, duration: 1.25, stagger: 0.07 }, 0.15);
      tl.to($$("[data-hero-item]", hero), { opacity: 1, y: 0, duration: 1, stagger: 0.09 }, 0.55);
      if (arabic) {
        gsap.to(arabic, {
          yPercent: -10, ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        });
      }
    }

    /* pointer spotlight on the Arabic wordmark — additive, fine pointers only */
    const arabic = $(".hero-arabic");
    if (arabic && hero && finePointer) {
      const rest = { x: 62, y: 45 };
      const cur = { ...rest };
      const target = { ...rest };
      let raf = 0;
      const step = () => {
        cur.x += (target.x - cur.x) * 0.12;
        cur.y += (target.y - cur.y) * 0.12;
        arabic.style.setProperty("--mx", cur.x.toFixed(2) + "%");
        arabic.style.setProperty("--my", cur.y.toFixed(2) + "%");
        raf = Math.abs(target.x - cur.x) > 0.05 || Math.abs(target.y - cur.y) > 0.05 ? requestAnimationFrame(step) : 0;
      };
      const kick = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(step); };
      const back = () => { target.x = rest.x; target.y = rest.y; kick(); };
      on(hero, "pointermove", (e) => {
        const r = arabic.getBoundingClientRect();
        target.x = Math.max(-10, Math.min(110, ((e.clientX - r.left) / r.width) * 100));
        target.y = Math.max(-10, Math.min(110, ((e.clientY - r.top) / r.height) * 100));
        kick();
      });
      on(hero, "pointerleave", back);
      on(window, "blur", back);
      on(document, "visibilitychange", () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else back(); });
    }

    /* generic reveals */
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 90%", once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.95, ease: "power3.out", stagger: 0.09, overwrite: true }),
    });

    /* counters — final value is already in the markup, so no-JS / reduced motion show it */
    $$("[data-counter]").forEach((el) => {
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const decimals = (String(el.dataset.counter).split(".")[1] || "").length;
      const fmt = (v) => prefix + v.toFixed(decimals) + suffix;
      const state = { v: 0 };
      el.textContent = fmt(0);
      ScrollTrigger.create({
        trigger: el, start: "top 92%", once: true,
        onEnter: () => gsap.to(state, { v: target, duration: 1.8, ease: "power3.out", onUpdate: () => (el.textContent = fmt(state.v)), onComplete: () => (el.textContent = fmt(target)) }),
      });
    });

    /* process: sticky column + active step + scrubbed progress line */
    const steps = $$(".step");
    if (steps.length) {
      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step, start: "top 62%", end: "bottom 62%",
          onToggle: (self) => step.classList.toggle("is-active", self.isActive),
        });
      });
      const bar = $(".process-progress i");
      const list = $(".steps");
      if (bar && list) {
        gsap.to(bar, { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 62%", end: "bottom 62%", scrub: true } });
      }
    }
  });

  /* measurements change when fonts and media settle */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  on(window, "load", () => ScrollTrigger.refresh());

  /* cleanup: animations, triggers, ticker, listeners, and the scroll engine */
  on(window, "pagehide", () => {
    ctx.revert();
    ScrollTrigger.getAll().forEach((t) => t.kill());
    if (tick) gsap.ticker.remove(tick);
    if (lenis) { lenis.destroy(); lenis = null; }
    ac.abort();
  });
})();
