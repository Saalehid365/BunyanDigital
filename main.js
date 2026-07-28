document.documentElement.classList.add("js-enabled");

// Full-screen logo intro: plays once per browser session, then reveals the page.
(function preloader() {
  const el = document.getElementById("preloader");
  if (!el) return;

  if (sessionStorage.getItem("bd_preloader_shown")) {
    el.remove();
    return;
  }

  document.body.classList.add("preloading");
  const finish = () => {
    document.body.classList.remove("preloading");
    sessionStorage.setItem("bd_preloader_shown", "1");
    el.remove();
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const logo = el.querySelector("img");

  if (typeof gsap === "undefined" || prefersReducedMotion || !logo) {
    setTimeout(finish, prefersReducedMotion ? 0 : 900);
    return;
  }

  gsap
    .timeline({ onComplete: finish })
    .set(logo, { scale: 0.6, opacity: 0 })
    .to(logo, { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" })
    .to(logo, { scale: 1, duration: 0.6 }) // hold at full size before zooming
    .to(logo, { scale: 14, duration: 1.1, ease: "power3.in" })
    .to(el, { opacity: 0, duration: 0.5, ease: "power1.out" }, "-=0.3");
})();

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Sticky header solid/blur after scroll
  const header = document.getElementById("site-header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add("header-solid", "border-b", "border-border");
    else header.classList.remove("header-solid", "border-b", "border-border");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Accordion (services/capabilities lists)
  document.querySelectorAll("[data-accordion] .accordion-item").forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    trigger?.addEventListener("click", () => {
      const group = item.closest("[data-accordion]");
      const openOnly = group?.hasAttribute("data-accordion-single");
      const wasOpen = item.classList.contains("open");
      if (openOnly) {
        group.querySelectorAll(".accordion-item.open").forEach((el) => el.classList.remove("open"));
      }
      item.classList.toggle("open", !wasOpen);
    });
  });

  // Mobile menu toggle
  const menuBtn = document.getElementById("menu-btn");
  const closeBtn = document.getElementById("menu-close");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("menu-overlay");
  const openMenu = () => {
    mobileMenu?.classList.add("open");
    overlay?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };
  const closeMenu = () => {
    mobileMenu?.classList.remove("open");
    overlay?.classList.add("hidden");
    document.body.style.overflow = "";
  };
  menuBtn?.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);
  mobileMenu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsapReady = typeof gsap !== "undefined";

  if (gsapReady) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Cycling word in hero panel ("we build ___.")
  document.querySelectorAll("[data-cycle-words]").forEach((el) => {
    const words = el.getAttribute("data-cycle-words").split(",").map((w) => w.trim());
    let i = 0;
    if (!gsapReady || prefersReducedMotion) return;
    setInterval(() => {
      i = (i + 1) % words.length;
      gsap.to(el, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: "power1.in",
        onComplete: () => {
          el.textContent = words[i];
          gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power1.out" });
        },
      });
    }, 2600);
  });

  if (gsapReady && !prefersReducedMotion) {
    // Hero entrance
    gsap.from("[data-hero-item]", {
      opacity: 0,
      y: 16,
      filter: "blur(12px)",
      duration: 0.9,
      stagger: 0.12,
      ease: "power2.out",
      delay: 0.1,
    });

    // Scroll reveals, grouped by section so staggers stay local
    document.querySelectorAll("[data-reveal-group]").forEach((group) => {
      const items = group.querySelectorAll(".reveal");
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: group,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Counters
    document.querySelectorAll("[data-counter]").forEach((el) => {
      const target = parseFloat(el.getAttribute("data-counter"));
      const suffix = el.getAttribute("data-suffix") || "";
      const counter = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            val: target,
            duration: 1.4,
            ease: "power1.out",
            onUpdate: () => {
              const isDecimal = target % 1 !== 0;
              el.textContent = (isDecimal ? counter.val.toFixed(1) : Math.round(counter.val)) + suffix;
            },
          });
        },
      });
    });

  } else {
    // No GSAP or reduced motion: reveal everything immediately, no animation
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    document.querySelectorAll("[data-counter]").forEach((el) => {
      const target = parseFloat(el.getAttribute("data-counter"));
      const suffix = el.getAttribute("data-suffix") || "";
      const isDecimal = target % 1 !== 0;
      el.textContent = (isDecimal ? target.toFixed(1) : Math.round(target)) + suffix;
    });
  }
});

// Footer newsletter signup: this static site has no backend to subscribe
// against, so submitting hands off to the visitor's email client with the
// address pre-filled rather than faking a success state.
(function newsletterForm() {
  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    const note = form.querySelector("[data-newsletter-note]") || form.parentElement.querySelector("[data-newsletter-note]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input?.value.trim();
      if (!email) return;
      const subject = encodeURIComponent("Newsletter signup");
      const body = encodeURIComponent(`Please add ${email} to the Bunyan Digital newsletter.`);
      window.location.href = `mailto:info@bunyandigital.co?subject=${subject}&body=${body}`;
      if (note) note.textContent = "Opening your email app to confirm...";
      form.reset();
    });
  });
})();

// Interactive process/service steps (home): auto-advancing highlighted step
// list with a crossfading image, click-to-jump, paused/instant under
// prefers-reduced-motion.
(function featureSteps() {
  document.querySelectorAll("[data-feature-steps]").forEach((wrap) => {
    const items = [...wrap.querySelectorAll("[data-feature-step]")];
    const images = [...wrap.querySelectorAll("[data-feature-image]")];
    if (!items.length || !images.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const interval = parseInt(wrap.getAttribute("data-interval"), 10) || 4000;
    let current = 0;
    let timer = null;

    const show = (index) => {
      current = index;
      items.forEach((item, i) => {
        item.classList.toggle("active", i === index);
        item.classList.toggle("done", i < index);
        const bar = item.querySelector("[data-feature-progress]");
        if (!bar) return;
        bar.style.animation = "none";
        bar.style.width = "";
        if (i === index && !prefersReducedMotion) {
          void bar.offsetWidth; // reflow to restart the animation
          bar.style.animation = `featureProgress ${interval}ms linear forwards`;
        } else {
          bar.style.width = i < index ? "100%" : "0%";
        }
      });
      images.forEach((img, i) => img.classList.toggle("active", i === index));
    };

    const advance = () => show((current + 1) % items.length);

    const restartTimer = () => {
      if (timer) clearInterval(timer);
      if (!prefersReducedMotion) timer = setInterval(advance, interval);
    };

    items.forEach((item, i) => {
      item.addEventListener("click", () => {
        show(i);
        restartTimer();
      });
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          show(i);
          restartTimer();
        }
      });
    });

    show(0);
    restartTimer();
  });
})();

// Scroll-velocity marquee: crawls at a base speed, speeds up (and can flip
// direction) with scroll velocity, mirroring a Framer Motion "text velocity"
// component but built on rAF/IntersectionObserver since this site has no
// React/motion runtime.
(function scrollVelocityMarquee() {
  const wrap = (min, max, v) => {
    const range = max - min;
    return ((((v - min) % range) + range) % range) + min;
  };

  document.querySelectorAll("[data-marquee]").forEach((container) => {
    const track = container.querySelector(".marquee-track");
    const block = track?.querySelector(".marquee-block");
    if (!track || !block) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const baseVelocity = parseFloat(container.getAttribute("data-marquee-speed")) || 3;

    let unitWidth = 0;
    let x = 0;
    let direction = 1;
    let lastScrollY = window.scrollY;
    let smoothVelocity = 0;
    let inView = true;
    let pageVisible = true;

    const measure = () => {
      unitWidth = block.getBoundingClientRect().width;
      const containerWidth = container.offsetWidth;
      const needed = unitWidth > 0 ? Math.max(3, Math.ceil(containerWidth / unitWidth) + 2) : 1;
      while (track.children.length < needed) track.appendChild(block.cloneNode(true));
      while (track.children.length > needed) track.removeChild(track.lastChild);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    measure();

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(container);

    document.addEventListener(
      "visibilitychange",
      () => {
        pageVisible = document.visibilityState === "visible";
      },
      { passive: true }
    );

    let lastTime = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05) || 1 / 60;
      lastTime = now;

      const scrollY = window.scrollY;
      const rawVelocity = (scrollY - lastScrollY) / dt;
      lastScrollY = scrollY;
      smoothVelocity += (rawVelocity - smoothVelocity) * Math.min(1, dt * 8);

      if (inView && pageVisible && unitWidth > 0) {
        const sign = smoothVelocity < 0 ? -1 : 1;
        const magnitude = Math.min(5, (Math.abs(smoothVelocity) / 1000) * 5);
        const absVf = Math.min(5, magnitude);
        const speedMultiplier = prefersReducedMotion ? 1 : 1 + absVf;

        if (absVf > 0.1) direction = sign;

        const pixelsPerSecond = (unitWidth * baseVelocity) / 100;
        x += direction * pixelsPerSecond * speedMultiplier * dt;
        track.style.transform = `translateX(${-wrap(0, unitWidth, x)}px)`;
      }

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
})();
