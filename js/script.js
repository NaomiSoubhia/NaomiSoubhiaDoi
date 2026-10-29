/**
 * Portfolio – Naomi Soubhia Doi
 *
 * Requires (loaded with `defer` before this file): GSAP, ScrollTrigger, Lenis.
 *
 * Structure
 *   1. Config and helpers
 *   2. Intro (loader + typed name)
 *   3. Smooth scroll, menu and anchor links
 *   4. Hero and About effects
 *   5. Education section (triangle grid, card slider, video crossfade)
 *   6. Work carousel
 *   7. Navigation colour theme
 *   8. Bootstrap
 */
(() => {
  "use strict";

  /* ======================================================================
     1. Config and helpers
     ====================================================================== */

  const CONFIG = Object.freeze({
    loader: { minVisibleMs: 2000 }, // keep in sync with --loader-duration in CSS
    typing: { delayMs: 80 },
    hero: { parallaxPx: 20, colourScrollPx: 400 },
    about: { startScale: 0.82 },
    education: {
      scrollLengthVh: 5, // pinned for this many viewport heights
      cardsTravelEnd: 0.654, // progress at which the cards stop sliding
      gridRevealStart: 0.65, // progress at which the triangles start filling
      navLightFrom: 0.7, // progress from which the page behind the nav is white
      canvasDriftPx: 130, // horizontal drift of the grid over the whole scroll
      triangleSize: 250,
      outlineWidth: 0.5,
      fillEase: 0.15,
      maxDpr: 2,
      videoFadeSeconds: 0.6,
    },
    work: { scrollMultiplier: 3 },
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  /** Runs `fn` at most once per animation frame. */
  function rafThrottle(fn) {
    let queued = false;
    return (...args) => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        fn(...args);
      });
    };
  }

  /** Runs `fn` once `wait` ms have passed without another call. */
  function debounce(fn, wait) {
    let timer = 0;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn(...args), wait);
    };
  }

  /** Distance from the top of the document, ignoring CSS transforms. */
  function pageOffsetTop(element) {
    let top = 0;
    for (let el = element; el; el = el.offsetParent) top += el.offsetTop;
    return top;
  }


  /* ======================================================================
     2. Intro: loader + typed name (no library dependencies)
     ====================================================================== */

  function typeText(element, text, delayMs) {
    let length = 0;
    const tick = () => {
      length += 1;
      element.textContent = text.slice(0, length);
      if (length < text.length) window.setTimeout(tick, delayMs);
    };
    tick();
  }

  function initIntro() {
    const loader = document.getElementById("loader");
    const name = document.getElementById("name");
    const fullName = name ? name.textContent.trim() : "";
    const shouldType = Boolean(name) && !prefersReducedMotion;

    // The <h1> keeps its aria-label, so assistive tech still reads the full name.
    if (shouldType) name.textContent = "";

    const reveal = () => {
      if (loader) {
        loader.classList.add("hide");
        loader.addEventListener("transitionend", () => loader.remove(), { once: true });
      }
      if (shouldType) typeText(name, fullName, CONFIG.typing.delayMs);
    };

    // performance.now() already counts the time the page took to load,
    // so slow connections are not made to wait an extra two seconds.
    const schedule = () => {
      const remaining = prefersReducedMotion ? 0 : CONFIG.loader.minVisibleMs - performance.now();
      window.setTimeout(reveal, Math.max(0, remaining));
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
  }


  /* ======================================================================
     3. Smooth scroll, menu and anchor links
     ====================================================================== */

  /** @returns {Lenis | null} null when reduced motion is requested or Lenis is missing */
  function initSmoothScroll() {
    if (prefersReducedMotion || typeof Lenis === "undefined") return null;

    const lenis = new Lenis({ smoothWheel: true, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return lenis;
  }

  /** @returns {{ close: () => void } | null} */
  function initMenu({ lenis }) {
    const nav = $("nav");
    const toggler = $(".nav-toggler");
    const menu = $(".menu");
    const content = $(".menu-content");
    if (!nav || !toggler || !menu || !content) return null;

    const label = $(".nav-toggler-text", toggler);
    const pageRegions = $$("#top, #main"); // made inert while the menu is open
    const offset = (px) => (prefersReducedMotion ? 0 : px);
    let isOpen = false;

    gsap.set(menu, { autoAlpha: 0 });

    const timeline = gsap
      .timeline({ paused: true })
      .to(menu, { autoAlpha: 1, duration: 0.4 })
      .fromTo(
        content,
        {
          y: offset(100),
          opacity: 0,
          rotateX: offset(-15),
          filter: prefersReducedMotion ? "blur(0px)" : "blur(15px)",
        },
        { y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)", duration: 1, ease: "power4.out" },
        "-=0.2"
      )
      .from(
        $$(".menu-link", menu),
        { y: offset(80), opacity: 0, duration: 0.7, stagger: 0.1, ease: "power4.out" },
        "-=0.7"
      )
      .from(
        $$(".menu-secondary-link", menu),
        { y: offset(30), opacity: 0, duration: 0.5, stagger: 0.05 },
        "-=0.5"
      );

    function setOpen(open) {
      if (open === isOpen) return;
      isOpen = open;

      if (open) {
        timeline.play();
        lenis?.stop();
      } else {
        timeline.reverse();
        lenis?.start();
      }

      toggler.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Close" : "Menu";
      document.documentElement.classList.toggle("is-menu-open", open);
      pageRegions.forEach((region) => {
        region.inert = open;
      });
    }

    toggler.addEventListener("click", () => setOpen(!isOpen));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen) {
        setOpen(false);
        toggler.focus();
      }
    });

    return { close: () => setOpen(false) };
  }

  /** In-page links: close the menu, then scroll (Lenis when available). */
  function initAnchorLinks({ lenis, menu }) {
    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;

      const link = event.target.closest('a[href^="#"]');
      if (!link) return;

      const target = document.getElementById(link.getAttribute("href").slice(1));
      if (!target) return; // e.g. "#contact" does not exist yet: let the browser handle it

      event.preventDefault();
      menu?.close();

      const top = pageOffsetTop(target);
      if (lenis) lenis.scrollTo(top, { force: true });
      else window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }


  /* ======================================================================
     4. Hero and About effects
     ====================================================================== */

  function initHeroEffects() {
    const portrait = $(".naomiTopImage");
    const secondary = $(".naomiTopImage2");
    if (!portrait || !secondary) return;

    // Grayscale → colour over the first pixels of scrolling.
    const colourOnScroll = {
      ease: "power3.out",
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: CONFIG.hero.colourScrollPx,
        scrub: true,
      },
    };
    gsap.fromTo(
      portrait,
      { filter: "grayscale(100%) contrast(150%)" },
      { filter: "grayscale(0%) contrast(150%)", ...colourOnScroll }
    );
    gsap.fromTo(
      secondary,
      { filter: "grayscale(100%) contrast(130%)" },
      { filter: "grayscale(0%) contrast(130%)", ...colourOnScroll }
    );

    // Mouse parallax (skipped on touch devices and for reduced motion).
    if (prefersReducedMotion || !hasFinePointer) return;

    const movers = [portrait, secondary].map((element) => ({
      x: gsap.quickTo(element, "x", { duration: 0.6, ease: "power3.out" }),
      y: gsap.quickTo(element, "y", { duration: 0.6, ease: "power3.out" }),
    }));

    window.addEventListener(
      "pointermove",
      (event) => {
        const x = (event.clientX / window.innerWidth - 0.5) * CONFIG.hero.parallaxPx;
        const y = (event.clientY / window.innerHeight - 0.5) * CONFIG.hero.parallaxPx;
        movers.forEach((mover) => {
          mover.x(x);
          mover.y(y);
        });
      },
      { passive: true }
    );
  }

  function initAboutReveal() {
    const about = $(".about");
    if (!about || prefersReducedMotion) return;

    gsap.fromTo(
      about,
      { scale: CONFIG.about.startScale, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: about, start: "top 90%", end: "top 20%", scrub: true },
      }
    );
  }


  /* ======================================================================
     5. Education section
     ====================================================================== */

  /**
   * Two stacked canvases: outlines underneath, filled triangles on top.
   * Triangles fill in a random order as `update(progress)` grows.
   */
  function createTriangleGrid(outlineCanvas, fillCanvas, cfg) {
    const outlineCtx = outlineCanvas.getContext("2d");
    const fillCtx = fillCanvas.getContext("2d");
    const half = cfg.triangleSize / 2;
    const MIN_VISIBLE_SCALE = 0.01;
    const SOLID_SCALE = 0.99;

    let triangles = [];
    let width = 0;
    let height = 0;
    let progress = 0;
    let gridVisible = false;
    let offsetX = 0;
    let frameId = 0;

    function fitCanvas(canvas, ctx) {
      const dpr = Math.min(window.devicePixelRatio || 1, cfg.maxDpr);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
    }

    function buildTriangles() {
      const stepX = half;
      const cols = Math.ceil(width / stepX) + 4;
      const rows = Math.ceil(height / cfg.triangleSize) + 1;
      const list = [];

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          list.push({
            x: col * stepX + half,
            y: row * cfg.triangleSize + half,
            flipped: (row + col) % 2 !== 0,
            order: 0,
            scale: 0,
          });
        }
      }

      // Fisher–Yates shuffle, then rank each triangle by its position.
      for (let i = list.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
      list.forEach((triangle, index) => {
        triangle.order = (index + 1) / list.length;
      });

      triangles = list;
    }

    function tracePath(ctx, x, y, flipped) {
      ctx.beginPath();
      if (flipped) {
        ctx.moveTo(x, y + half);
        ctx.lineTo(x + half, y - half);
        ctx.lineTo(x - half, y - half);
      } else {
        ctx.moveTo(x, y - half);
        ctx.lineTo(x + half, y + half);
        ctx.lineTo(x - half, y + half);
      }
      ctx.closePath();
    }

    function drawFilled(triangle) {
      const x = triangle.x + offsetX;
      const y = triangle.y;
      const solid = triangle.scale >= SOLID_SCALE;
      // A 0.6% overscale hides hairline gaps between fully filled neighbours.
      const scale = solid ? triangle.scale * 1.006 : triangle.scale;

      fillCtx.save();
      fillCtx.translate(x, y);
      fillCtx.scale(scale, scale);
      fillCtx.translate(-x, -y);
      tracePath(fillCtx, x, y, triangle.flipped);
      fillCtx.lineWidth = solid ? 1.5 : cfg.outlineWidth;
      fillCtx.stroke();
      fillCtx.fill();
      fillCtx.restore();
    }

    function render() {
      frameId = 0;

      outlineCtx.clearRect(0, 0, width, height);
      fillCtx.clearRect(0, 0, width, height);

      if (!gridVisible) return;

      // Resizing a canvas resets its state, so styles are set every frame.
      outlineCtx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      outlineCtx.lineWidth = cfg.outlineWidth;
      fillCtx.fillStyle = "#fff";
      fillCtx.strokeStyle = "#fff";

      const reveal = clamp((progress - cfg.gridRevealStart) / (1 - cfg.gridRevealStart), 0, 1);
      let animating = false;


      for (const triangle of triangles) {
        // Always draw the outline grid.
        tracePath(
          outlineCtx,
          triangle.x + offsetX,
          triangle.y,
          triangle.flipped
        );
        outlineCtx.stroke();

        const filled =
          reveal >= 0.99 ||
          (reveal > 0 && triangle.order <= reveal);

        const target = filled ? 1 : 0;

        triangle.scale += (target - triangle.scale) * cfg.fillEase;

        if (Math.abs(target - triangle.scale) > 0.001) {
          animating = true;
        } else {
          triangle.scale = target;
        }

        if (triangle.scale >= MIN_VISIBLE_SCALE) {
          drawFilled(triangle);
        }
      }


      // Keep animating until every triangle has settled.
      if (animating) frameId = requestAnimationFrame(render);
    }

    function schedule() {
      if (!frameId) frameId = requestAnimationFrame(render);
    }

    function resize() {
      width = outlineCanvas.clientWidth || window.innerWidth;
      height = outlineCanvas.clientHeight || window.innerHeight;
      fitCanvas(outlineCanvas, outlineCtx);
      fitCanvas(fillCanvas, fillCtx);
      buildTriangles();
      schedule();
    }

    function update(newProgress, newOffsetX, newVisibility = false) {
      progress = newProgress;
      offsetX = newOffsetX;
      gridVisible = newVisibility;
      schedule();
    }

    resize();
    return { update, resize };
  }

  /**
   * Crossfades between two stacked <video> elements. The second one is cloned
   * from the first so the HTML only needs a single background video.
   */
  function createVideoCrossfade(primary, fadeSeconds) {
    const secondary = primary.cloneNode(true);
    secondary.id = "secondary-bg-video";
    $$("source", secondary).forEach((source) => source.remove()); // avoid a duplicate download
    primary.parentNode.appendChild(secondary);
    gsap.set(secondary, { opacity: 0 });

    const sourceOf = (video) =>
      $("source", video)?.getAttribute("src") ?? video.getAttribute("src") ?? "";

    let active = primary;
    let idle = secondary;
    let currentSrc = sourceOf(primary);
    let requestId = 0;

    function show(src) {
      if (!src || src === currentSrc) return;
      currentSrc = src;

      const incoming = idle;
      const outgoing = active;
      const thisRequest = (requestId += 1);

      incoming.addEventListener(
        "loadedmetadata",
        () => {
          if (thisRequest !== requestId) return; // a newer card was selected meanwhile

          incoming.play().catch(() => { }); // autoplay can be refused; the poster frame is fine
          gsap.to(incoming, { opacity: 1, duration: fadeSeconds, ease: "power1.inOut", overwrite: true });
          gsap.to(outgoing, { opacity: 0, duration: fadeSeconds, ease: "power1.inOut", overwrite: true });

          active = incoming;
          idle = outgoing;
        },
        { once: true }
      );

      incoming.src = src;
      incoming.load();
    }

    return { show };
  }

  /** @returns {{ isFilled: () => boolean } | null} */
  function initEducation() {
    const cfg = CONFIG.education;
    const section = $(".sticky");
    const cardsEl = section && $(".cards", section);
    const outlineCanvas = section && $(".outline-layer", section);
    const fillCanvas = section && $(".fill-layer", section);
    if (!section || !cardsEl || !outlineCanvas || !fillCanvas) return null;

    const cards = $$(".card", cardsEl);
    const backgroundVideo = $("#main-bg-video", section);
    const videos = backgroundVideo ? createVideoCrossfade(backgroundVideo, cfg.videoFadeSeconds) : null;
    const grid = createTriangleGrid(outlineCanvas, fillCanvas, cfg);
    const setCardsX = gsap.quickSetter(cardsEl, "x", "px");

    /** The card whose centre is closest to the middle of the screen. */
    function getCenteredCard() {
      const screenCenter = window.innerWidth / 2;
      let closest = null;
      let closestDistance = Infinity;

      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(screenCenter - (rect.left + rect.width / 2));
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = card;
        }
      }
      return closest;
    }

function applyProgress(progress, isVisible = false) {
  const cardsProgress = clamp(progress / cfg.cardsTravelEnd, 0, 1);

  setCardsX(-cardsProgress * window.innerWidth * 2);

  // Keep the grid visible after the scroll animation finishes.
  // Hide it only when scrolling back before the sticky section.
  const shouldShowGrid = isVisible || progress >= 1;

  grid.update(
    progress,
    -progress * cfg.canvasDriftPx,
    shouldShowGrid
  );

  videos?.show(getCenteredCard()?.dataset.video);
}

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * cfg.scrollLengthVh}`,
      pin: true,
      invalidateOnRefresh: true,

      onUpdate: (self) => {
        applyProgress(self.progress, self.isActive);
      },
    });

    window.addEventListener(
      "resize",
      debounce(() => {
        grid.resize();
        applyProgress(trigger.progress, trigger.isActive);
      }, 200)
    );

    applyProgress(trigger.progress, trigger.isActive);

    return { isFilled: () => trigger.progress >= cfg.navLightFrom };
  }


  /* ======================================================================
     6. Work carousel
     ====================================================================== */

  function initWorkCarousel() {
    const section = $(".work");
    const carousel = $(".carousel");
    const blocks = $$(".block", carousel ?? document);
    if (!section || !carousel || blocks.length === 0) return;

    // Measured lazily so values stay correct after a resize/refresh.
    const measure = () => {
      const gap = parseFloat(getComputedStyle(carousel).gap) || 0;
      const blockHeight = blocks[0].offsetHeight;
      return {
        centerOffset: (window.innerHeight - blockHeight) / 2,
        travel: (blocks.length - 1) * (blockHeight + gap),
      };
    };

    gsap.fromTo(
      carousel,
      { y: () => measure().centerOffset },
      {
        y: () => measure().centerOffset - measure().travel,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${measure().travel * CONFIG.work.scrollMultiplier}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
  }


  /* ======================================================================
     7. Navigation colour theme
     ====================================================================== */

  /**
   * Toggles `nav.light` (dark text) when the page behind the Menu button is
   * light. One rule for the whole page instead of several scroll handlers
   * fighting over the same class.
   */
  function initNavTheme({ isEducationFilled }) {
    const nav = $("nav");
    const toggler = $(".nav-toggler");
    if (!nav || !toggler) return;

    function isLightBehind(element) {
      if (element.closest(".about")) return !element.closest(".textAbout"); // text column is black
      if (element.closest(".sticky")) return isEducationFilled();
      return Boolean(element.closest(".projects"));
    }

    function update() {
      const rect = toggler.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Ignore the nav itself so we see what is actually underneath it.
      const behind = document.elementsFromPoint(x, y).find((element) => !nav.contains(element));
      if (behind) nav.classList.toggle("light", isLightBehind(behind));
    }

    const scheduleUpdate = rafThrottle(update);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("load", scheduleUpdate);
    ScrollTrigger.addEventListener("refresh", scheduleUpdate);
    update();
  }


  /* ======================================================================
     8. Bootstrap
     ====================================================================== */

  function init() {
    initIntro();

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("GSAP failed to load: scroll animations and the menu are disabled.");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = initSmoothScroll();
    const menu = initMenu({ lenis });
    initAnchorLinks({ lenis, menu });

    initHeroEffects();
    initAboutReveal();
    const education = initEducation(); // pinned sections must be created in page order
    initWorkCarousel();

    initNavTheme({ isEducationFilled: education ? education.isFilled : () => false });
  }

  init();
})();
