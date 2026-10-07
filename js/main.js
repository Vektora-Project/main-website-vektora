/* =========================================================
   VEKTORA PROJECT — interactions & motion
   GSAP + ScrollTrigger + Lenis (loaded from CDN)
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  // Touch devices / small screens get a lighter motion profile (no live SVG filter, no smooth-scroll hijack)
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const lite = isTouch || window.innerWidth <= 900;
  if (lite) document.documentElement.classList.add("is-lite");

  document.body.classList.add("is-loading");

  /* ---------- Split words (keeps text accessible) ---------- */
  $$(".split").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words
      .map((w) => `<span class="w" aria-hidden="true"><span>${w}</span></span>`)
      .join(" ");
  });

  /* ---------- Fit giant words to container width ---------- */
  const fitMega = () => {
    $$(".mega").forEach((el) => {
      const row = $(".mega__row", el);
      el.style.fontSize = "100px";
      const w = row.scrollWidth;
      const target = el.clientWidth;
      el.style.fontSize = (100 * target) / w + "px";
    });
  };
  fitMega();
  document.fonts && document.fonts.ready.then(() => { fitMega(); hasGSAP && ScrollTrigger.refresh(); });
  let rT, lastW = window.innerWidth;
  window.addEventListener("resize", () => {
    // mobile browsers fire resize when the address bar shows/hides — only refit on real width changes
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    clearTimeout(rT); rT = setTimeout(fitMega, 120);
  });

  /* ---------- Mobile menu ---------- */
  const burger = $(".nav__burger");
  const menu = $(".mobile-menu");
  const toggleMenu = (open) => {
    burger.setAttribute("aria-expanded", open);
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", !open);
  };
  burger.addEventListener("click", () => toggleMenu(burger.getAttribute("aria-expanded") !== "true"));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  /* ---------- Contact form → WhatsApp ---------- */
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const msg =
      `Halo Vektora, saya ${f.get("nama")}` +
      (f.get("bisnis") ? ` dari ${f.get("bisnis")}` : "") +
      `.\n\nKebutuhan: ${f.get("pesan")}`;
    window.open(`https://wa.me/6281998888967?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });

  /* ---------- No GSAP / reduced motion: show everything ---------- */
  const done = () => {
    document.body.classList.remove("is-loading");
    const pre = $(".preloader");
    pre && pre.remove();
  };
  if (!hasGSAP) { done(); return; }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (!reduced && !isTouch && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id === "#top" ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      lenis ? lenis.scrollTo(target, { offset: 0, duration: 1.4 }) : (target === 0 ? scrollTo(0, 0) : target.scrollIntoView({ behavior: "smooth" }));
    })
  );

  if (reduced) {
    done();
    $$(".count, [data-count]").forEach((el) => (el.textContent = el.dataset.count));
    return;
  }

  /* ---------- Preloader → intro ---------- */
  const counter = { v: 0 };
  const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
  intro
    .fromTo(".preloader__word span", { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.06 })
    .to(counter, {
      v: 100, duration: 1.4, ease: "power2.inOut",
      onUpdate: () => ($("#count").textContent = Math.round(counter.v)),
    }, 0)
    .to(".preloader__bar i", { width: "100%", duration: 1.4, ease: "power2.inOut" }, 0)
    .to(".preloader__word span", { yPercent: -110, duration: 0.7, stagger: 0.04, ease: "expo.in" }, "+=0.1")
    .to(".preloader", { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=0.3")
    .add(() => { done(); lenis && lenis.start(); })
    .from(".hero__panel", { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "expo.inOut" }, "-=0.9")
    .from(".hero__liquid", { clipPath: "inset(100% 0 0 0)", duration: 1.2, ease: "expo.inOut" }, "<0.08")
    .from(".hero__lead .w > span", { yPercent: 110, duration: 1.1, stagger: 0.025 }, "-=0.5")
    .from(".hero__panel .reveal-up", { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, "<0.2")
    .from(".hero__mark", { scale: 0, rotate: -40, duration: 1.4, ease: "elastic.out(1, .6)" }, "<")
    .from(".hero .mega .ch", { yPercent: 105, duration: 1.3, stagger: 0.05 }, "<0.1")
    .from(".hero__meta ul, .hero__meta .scroll-dot", { y: 20, opacity: 0, duration: 0.9, stagger: 0.06 }, "<0.4")
    .from(".hero .dashline", { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "power3.inOut" }, "<");

  /* ---------- Liquid (animated SVG turbulence) ---------- */
  const turb = $("#turb");
  if (turb && lite) {
    // Static filter (rendered once) + GPU-only drift via CSS — animating the filter itself is too heavy for phones
    turb.setAttribute("numOctaves", "2");
  } else if (turb) {
    let t = 0, last = 0, liquidVisible = true;
    const vis = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? vis.add(en.target) : vis.delete(en.target)));
      liquidVisible = vis.size > 0;
    });
    $$(".hero__liquid, .footer__liquid").forEach((el) => io.observe(el));
    gsap.ticker.add((time) => {
      if (!liquidVisible || time - last < 1 / 30) return; // ~30fps, and only while on screen
      last = time;
      t += 0.012;
      const fx = 0.008 + Math.sin(t) * 0.0025;
      const fy = 0.014 + Math.cos(t * 0.8) * 0.004;
      turb.setAttribute("baseFrequency", `${fx.toFixed(5)} ${fy.toFixed(5)}`);
    });
    gsap.to(".stripes path", { x: 40, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.4 });
  }
  gsap.to(".hero__mark", { y: -14, rotate: 4, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });

  // Hero parallax on scroll (desktop only)
  if (!lite) {
    gsap.to(".hero .mega__row", {
      yPercent: 18, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero__liquid .liquid", {
      yPercent: 12, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  }

  /* ---------- Nav state ---------- */
  const nav = $(".nav");
  ScrollTrigger.create({
    start: () => $(".hero__top").offsetHeight - 60,
    end: "max",
    onToggle: (self) => nav.classList.toggle("is-dark", self.isActive),
  });
  ScrollTrigger.create({
    start: 200, end: "max",
    onUpdate: (self) => nav.classList.toggle("is-hidden", self.direction === 1 && !menu.classList.contains("is-open")),
  });

  /* ---------- Marquee reacts to scroll velocity ---------- */
  const mq = gsap.to(".marquee__track", { xPercent: -50, duration: 22, ease: "none", repeat: -1 });
  let mqDir = 1;
  if (!lite) ScrollTrigger.create({
    onUpdate: (self) => {
      mqDir = self.direction;
      const boost = gsap.utils.clamp(1, 7, 1 + Math.abs(self.getVelocity()) / 400);
      gsap.to(mq, { timeScale: mqDir * boost, duration: 0.2, overwrite: true,
        onComplete: () => gsap.to(mq, { timeScale: mqDir, duration: 1.2, ease: "power2.out" }) });
    },
  });

  /* ---------- Split-word reveals ---------- */
  $$(".split").forEach((el) => {
    if (el.classList.contains("hero__lead")) return;
    gsap.from($$(".w > span", el), {
      yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.035,
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
  $$(".eyebrow").forEach((el) => {
    if (el.closest(".hero")) return;
    gsap.from(el, { opacity: 0, x: -20, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
  });

  /* ---------- Works: horizontal pinned scroll (desktop) ---------- */
  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", () => {
    const track = $(".works__track");
    const dist = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: ".works",
        start: "bottom bottom",
        end: () => "+=" + dist(),
        pin: ".works",
        pinSpacing: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
    gsap.to(".works__progress i", {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: ".works", start: "bottom bottom", end: () => "+=" + dist(), scrub: true },
    });
    // mock contents animate as each card enters
    $$(".card").forEach((card) => {
      const visibleAtStart = card.getBoundingClientRect().left < window.innerWidth * 0.8;
      animateCard(card, visibleAtStart
        ? { trigger: ".works__pin", start: "top 70%" }
        : { containerAnimation: tween, trigger: card, start: "left 80%" });
    });
    return () => {};
  });
  mm.add("(max-width: 900px)", () => {
    $$(".card").forEach((card) => {
      gsap.from(card, { y: 60, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 88%" } });
      animateCard(card, { trigger: card, start: "top 70%" });
    });
  });

  function animateCard(card, st) {
    const tl = gsap.timeline({ scrollTrigger: { ...st, toggleActions: "play none none none" } });
    const bars = $$(".bars i", card);
    const rooms = $$(".rooms span", card);
    const sched = $$(".sched span", card);
    const line = $(".line__stroke", card);
    if (bars.length) tl.from(bars, { scaleY: 0, duration: 1, stagger: 0.06, ease: "expo.out" }, 0);
    if (rooms.length) tl.from(rooms, { scale: 0, duration: 0.5, stagger: { each: 0.015, from: "random" }, ease: "back.out(2)" }, 0);
    if (sched.length) tl.from(sched, { y: 10, opacity: 0, duration: 0.5, stagger: 0.03, ease: "expo.out" }, 0);
    if (line) {
      const len = line.getTotalLength();
      tl.fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 0);
      tl.from($(".line__area", card), { opacity: 0, duration: 1 }, 0.6);
    }
    const prog = $(".progress i", card);
    if (prog) tl.from(prog, { scaleX: 0, duration: 1.4, ease: "expo.out" }, 0.2);
    $$("[data-count]", card).forEach((el) => countUp(el, tl));
    const cta = $$(".cta-big span", card);
    if (cta.length) tl.from(cta, { yPercent: 60, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out" }, 0);
  }

  function countUp(el, tl) {
    const end = +el.dataset.count;
    const o = { v: 0 };
    const tw = { v: end, duration: 1.6, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.v)) };
    tl ? tl.to(o, tw, 0) : gsap.to(o, { ...tw, scrollTrigger: { trigger: el, start: "top 85%" } });
  }
  $$(".stats [data-count]").forEach((el) => countUp(el));

  /* ---------- Card tilt ---------- */
  if (finePointer) {
    $$(".card").forEach((card) => {
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
      gsap.set(card, { transformPerspective: 1100 });
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
      });
      card.addEventListener("mouseleave", () => { rx(0); ry(0); });
    });
  }

  /* ---------- Products ---------- */
  gsap.from(".prod", {
    y: 50, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.12,
    scrollTrigger: { trigger: ".prod-grid", start: "top 80%" },
  });

  /* ---------- Services ---------- */
  gsap.from(".svc__item", {
    y: 50, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.12,
    scrollTrigger: { trigger: ".svc", start: "top 80%" },
  });

  /* ---------- Process line ---------- */
  const steps = $$(".step");
  gsap.to(".steps__line i", {
    scaleX: 1, ease: "none",
    scrollTrigger: {
      trigger: ".steps", start: "top 75%", end: "bottom 45%", scrub: true,
      onUpdate: (self) => steps.forEach((s, i) => s.classList.toggle("is-on", self.progress >= i / (steps.length - 1) - 0.01)),
    },
  });
  gsap.from(steps, {
    y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1,
    scrollTrigger: { trigger: ".steps", start: "top 82%" },
  });

  /* ---------- Footer ---------- */
  gsap.from(".mega--footer .ch", {
    yPercent: 105, duration: 1.2, ease: "expo.out", stagger: 0.04,
    scrollTrigger: { trigger: ".mega--footer", start: "top 92%" },
  });
  gsap.from(".footer__title", { y: 40, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".footer__title", start: "top 85%" } });
  gsap.from(".footer .dashline", { scaleX: 0, transformOrigin: "left", duration: 1.6, ease: "power3.inOut", scrollTrigger: { trigger: ".footer .dashline", start: "top 98%" } });

  // Mega letters wave on hover
  $$(".mega .ch").forEach((ch) => {
    ch.addEventListener("mouseenter", () => {
      gsap.fromTo(ch, { y: 0 }, { y: "-0.08em", color: "#3fa3db", duration: 0.3, ease: "power2.out", yoyo: true, repeat: 1, onComplete: () => gsap.set(ch, { clearProps: "color" }) });
    });
  });

  /* ---------- Cursor ---------- */
  if (finePointer) {
    const cur = $(".cursor");
    const label = $(".cursor__label");
    const xTo = gsap.quickTo(cur, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(cur, "y", { duration: 0.45, ease: "power3" });
    window.addEventListener("mousemove", (e) => { xTo(e.clientX); yTo(e.clientY); });
    $$("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => { label.textContent = el.dataset.cursor; cur.classList.add("is-big"); });
      el.addEventListener("mouseleave", () => cur.classList.remove("is-big"));
    });
    $$("a, button, input").forEach((el) => {
      el.addEventListener("mouseenter", () => cur.classList.add("is-link"));
      el.addEventListener("mouseleave", () => cur.classList.remove("is-link"));
    });

    /* Magnetic buttons */
    $$(".magnetic").forEach((btn) => {
      const x = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
      const y = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });
      const inner = $("span", btn);
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        x(dx * 0.3); y(dy * 0.4);
        gsap.to(inner, { x: dx * 0.12, y: dy * 0.15, duration: 0.5, ease: "power3" });
      });
      btn.addEventListener("mouseleave", () => { x(0); y(0); gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, .4)" }); });
    });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
