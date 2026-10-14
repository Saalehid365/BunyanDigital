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

  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
