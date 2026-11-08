(() => {
  const $ = (s, r = document) => r.querySelector(s);

  /* header rule appears once the page scrolls */
  const header = $(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* mobile menu */
  const btn = $("#menu-btn");
  const panel = $("#mobile-nav");
  if (btn && panel) {
    const setOpen = (open) => {
      btn.setAttribute("aria-expanded", String(open));
      btn.querySelector("[data-label]").textContent = open ? "Close" : "Menu";
      panel.hidden = !open;
    };
    btn.addEventListener("click", () => setOpen(panel.hidden));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { setOpen(false); btn.focus(); } });
    window.matchMedia("(min-width: 1180px)").addEventListener("change", (m) => { if (m.matches) setOpen(false); });
  }

  /* forms: submit to Netlify Forms, fall back to the visitor's email app if that fails */
  const wireForm = (form, note, subjectPrefix, okMessage) => {
    if (!form) return;
    const submit = $("button[type=submit]", form);
    form.addEventListener("submit", async (e) => {
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
        if (note) note.textContent = "We couldn't send that automatically, so your email app is opening instead. You can also email info@bunyandigital.co.";
        window.location.href = "mailto:info@bunyandigital.co?subject=" + encodeURIComponent(subjectPrefix + (d.get("name") || "")) + "&body=" + encodeURIComponent(lines.join("\n"));
      } finally {
        window.setTimeout(() => { if (submit) submit.disabled = false; }, 2500);
      }
    });
  };
  wireForm($("#contact-form"), $("#form-note"), "New project inquiry from ", "Thanks, we've got your message. We'll reply within one business day.");
  wireForm($("#finder-form"), $("#finder-note"), "7-Day Revenue Finder application from ", "Thanks, your application is in. We'll confirm whether you qualify within one business day.");

  /* rolling word: each letter of a [data-roll] word spins through copies of itself
     and lands, slot-machine style, once the word scrolls into view. Ported from the
     RollingText component (expo.out easing, per-letter cycles and duration from a
     seeded PRNG). Without JS the word is plain text. */
  const mulberry32 = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const expoOut = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
  document.querySelectorAll("[data-roll]").forEach((el) => {
    const text = el.textContent;
    const minCycles = 3, cycleVariance = 3, duration = 2.4, durationVariance = 1.2;
    el.classList.add("roll");
    el.setAttribute("role", "text");
    el.setAttribute("aria-label", text);
    el.textContent = "";
    const reels = [...text].map((ch, i) => {
      const rand = mulberry32(i * 1013 + 7);
      const to = minCycles + Math.floor(rand() * cycleVariance);
      const cell = document.createElement("span");
      cell.className = "roll-cell";
      cell.setAttribute("aria-hidden", "true");
      const ghost = document.createElement("span");
      ghost.className = "roll-ghost";
      ghost.textContent = ch;
      const win = document.createElement("span");
      win.className = "roll-win";
      const reel = document.createElement("span");
      reel.className = "roll-reel";
      for (let c = 0; c <= to; c++) {
        const copy = document.createElement("span");
        copy.textContent = ch;
        reel.append(copy);
      }
      win.append(reel);
      cell.append(ghost, win);
      el.append(cell);
      return { reel, to, ms: (duration + rand() * durationVariance) * 1000 };
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reels.forEach((r) => r.reel.style.setProperty("--k", r.to));
      return;
    }
    const spin = () => {
      const start = performance.now();
      const tick = (now) => {
        let running = false;
        reels.forEach((r) => {
          const p = Math.min(1, (now - start) / r.ms);
          r.reel.style.setProperty("--k", (r.to * expoOut(p)).toFixed(4));
          if (p < 1) running = true;
        });
        if (running) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      spin();
    }, { threshold: 0.6 });
    io.observe(el);
  });

  /* animated borders: only spin the light while the card is on (or near) the screen */
  const glows = document.querySelectorAll("[data-glow]");
  if (glows.length) {
    const glowIO = new IntersectionObserver((entries) => entries.forEach((en) => en.target.classList.toggle("is-in-view", en.isIntersecting)), { rootMargin: "100px" });
    glows.forEach((g) => glowIO.observe(g));
  }

  /* feature carousel: store names on a vertical reel (left) and the store homepages
     (right). Moves on every few seconds; click a name to jump forward to it. Pauses
     while hovered, focused, off screen or in a background tab. Ported from the
     FeatureCarousel component. */
  document.querySelectorAll("[data-fc]").forEach((root) => {
    const items = [...root.querySelectorAll(".fc-item")];
    const chips = items.map((it) => $(".fc-chip", it));
    const cards = [...root.querySelectorAll(".fc-card")];
    const n = cards.length;
    if (n < 2) return;
    const ITEM_H = 65;
    const interval = Number(root.dataset.interval) || 3000;
    let step = 0;
    let paused = false;
    let seen = false;
    const index = () => ((step % n) + n) % n;
    // signed distance from the active item, wrapped into [-n/2, n/2)
    const wrapped = (i) => {
      const d = (((i - index()) % n) + n) % n;
      return d >= n / 2 ? d - n : d;
    };
    const lastD = items.map((_, i) => wrapped(i));
    const render = () => {
      items.forEach((it, i) => {
        const d = wrapped(i);
        // A name wrapping from one end of the reel to the other would slide through the
        // active chip (with only a few stores), so it jumps there unseen and fades back in.
        if (Math.abs(d - lastD[i]) > 1) {
          it.style.transition = "none";
          it.style.opacity = "0";
          it.style.transform = `translateY(${d * ITEM_H}px)`;
          void it.offsetHeight;
          it.style.transition = "";
        } else {
          it.style.transform = `translateY(${d * ITEM_H}px)`;
        }
        lastD[i] = d;
        it.style.opacity = String(1 - Math.abs(d) * 0.25);
        chips[i].setAttribute("aria-pressed", d === 0 ? "true" : "false");
      });
      cards.forEach((card, i) => {
        const d = wrapped(i);
        const status = d === 0 ? "active" : d === -1 ? "prev" : d === 1 ? "next" : "hidden";
        card.dataset.status = status;
        if (status === "active") card.removeAttribute("aria-hidden");
        else card.setAttribute("aria-hidden", "true");
      });
    };
    chips.forEach((chip, i) =>
      chip.addEventListener("click", () => {
        const diff = (i - index() + n) % n;
        if (diff > 0) {
          step += diff;
          render();
        }
      }),
    );
    root.addEventListener("pointerenter", () => (paused = true));
    root.addEventListener("pointerleave", () => (paused = false));
    root.addEventListener("focusin", () => (paused = true));
    root.addEventListener("focusout", (e) => { if (!root.contains(e.relatedTarget)) paused = false; });
    new IntersectionObserver(([en]) => (seen = en.isIntersecting), { threshold: 0.3 }).observe(root);
    window.setInterval(() => {
      if (paused || !seen || document.hidden) return;
      step += 1;
      render();
    }, interval);
    render();
  });

  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
