(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var escHTML = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* -----------------------------------------------------------
     Footer year (idempotent, tiny enrichment)
     ----------------------------------------------------------- */
  function initYear() {
    var el = $("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------------
     Splash — double safety net (CSS handles the 4.5s fallback)
     ----------------------------------------------------------- */
  function initSplash() {
    var splash = $("[data-splash]");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-out"); };
    if (document.readyState === "complete") setTimeout(hide, 500);
    else window.addEventListener("load", function () { setTimeout(hide, 350); });
    setTimeout(hide, 3800);
  }

  /* -----------------------------------------------------------
     Nav — solidify on scroll + mobile burger
     ----------------------------------------------------------- */
  function initNav() {
    var nav = $("[data-nav]");
    if (nav) {
      var onScroll = function () {
        if (window.scrollY > 60) nav.classList.add("is-scrolled");
        else nav.classList.remove("is-scrolled");
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    var burger = $("[data-nav-burger]");
    var mobile = $("[data-nav-mobile]");
    if (!burger || !mobile) return;
    var toggle = function (open) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      mobile.setAttribute("aria-hidden", open ? "false" : "true");
      document.documentElement.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () {
      toggle(burger.getAttribute("aria-expanded") !== "true");
    });
    $$("a", mobile).forEach(function (a) {
      a.addEventListener("click", function () { toggle(false); });
    });
  }

  /* -----------------------------------------------------------
     Smooth anchor scrolling (native)
     ----------------------------------------------------------- */
  function initSmoothAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 88;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - navOffset,
        behavior: reduced ? "auto" : "smooth",
      });
    });
  }

  /* -----------------------------------------------------------
     Split text (chars / words) — preserves <br>
     ----------------------------------------------------------- */
  function wrapChars(text) {
    return Array.prototype.map.call(text, function (ch) {
      return ch === " " ? " " : '<span class="split-char" aria-hidden="true">' + escHTML(ch) + "</span>";
    }).join("");
  }
  function wrapWords(text) {
    return text.split(/(\s+)/).map(function (w) {
      return /^\s+$/.test(w) ? w : '<span class="split-word" aria-hidden="true">' + escHTML(w) + "</span>";
    }).join("");
  }
  function splitEl(el, mode) {
    el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
    var wrap = mode === "chars" ? wrapChars : wrapWords;
    var html = Array.prototype.map.call(el.childNodes, function (node) {
      if (node.nodeType === 3) return wrap(node.textContent);
      if (node.nodeName === "BR") return "<br>";
      if (node.nodeType === 1) {
        var tag = node.tagName.toLowerCase();
        return "<" + tag + ">" + wrap(node.textContent) + "</" + tag + ">";
      }
      return "";
    }).join("");
    el.innerHTML = html;
    return $$(mode === "chars" ? ".split-char" : ".split-word", el);
  }

  function initSplitText() {
    if (!window.gsap || !window.ScrollTrigger) return;
    $$("[data-split]").forEach(function (el) {
      var mode = el.dataset.split;
      var parts = splitEl(el, mode);
      if (!parts.length) return;
      gsap.set(parts, { y: mode === "chars" ? 18 : 26, opacity: 0 });
      gsap.to(parts, {
        y: 0, opacity: 1,
        duration: mode === "chars" ? 0.7 : 0.95,
        stagger: mode === "chars" ? 0.016 : 0.045,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    });
  }

  /* -----------------------------------------------------------
     Scroll reveal (universal) with 6s safety net
     ----------------------------------------------------------- */
  function initReveals() {
    var els = $$("[data-reveal]");
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-revealed");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.02, rootMargin: "0px 0px -2% 0px" });
    els.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      $$("[data-reveal]:not(.is-revealed)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-revealed");
        }
      });
    }, 6000);

    /* Masks with clip-path can't self-observe: a clipped element reports
       a zero-area intersection rect, so IntersectionObserver never fires
       on itself. The hero mask is always above the fold, so reveal it
       directly on load instead of waiting on IO. */
    var masks = $$("[data-reveal-mask]");
    if (masks.length) {
      var revealMasks = function () {
        masks.forEach(function (m) { m.classList.add("is-revealed"); });
      };
      if (document.readyState === "complete") setTimeout(revealMasks, 300);
      else window.addEventListener("load", function () { setTimeout(revealMasks, 200); });
      setTimeout(revealMasks, 3000);
    }
  }

  /* -----------------------------------------------------------
     Custom cursor with contextual labels
     ----------------------------------------------------------- */
  function initCursor() {
    var root = $("[data-cursor-root]");
    if (!root || !fineHover) return;
    document.documentElement.classList.add("has-cursor");

    var arrow = $(".cursor-arrow", root);
    var halo = $(".cursor-halo", root);
    var labelPill = $(".cursor-label", root);
    var labelText = $("[data-cursor-label]", root);

    // Position (lerp-follow, never 1:1) — animates transform only.
    var tx = 0, ty = 0, cx = 0, cy = 0, firstMove = false;
    // Rotation toward travel direction (lerp'd separately so it doesn't jitter).
    var angle = 0, targetAngle = -45; // -45 compensates the arrow's own tip offset
    var lastX = 0, lastY = 0;
    var LERP_POS = 0.18; // 0.15–0.2 per spec

    window.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      var dx = tx - lastX, dy = ty - lastY;
      if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) {
        targetAngle = Math.atan2(dy, dx) * 180 / Math.PI - 45;
      }
      lastX = tx; lastY = ty;
      if (!firstMove) {
        firstMove = true;
        cx = tx; cy = ty;
        root.classList.add("is-ready");
      }
    }, { passive: true });

    function tick() {
      cx += (tx - cx) * LERP_POS;
      cy += (ty - cy) * LERP_POS;
      var diff = targetAngle - angle;
      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;
      angle += diff * 0.18;
      var pos = "translate3d(" + cx + "px," + cy + "px,0)";
      if (arrow) arrow.style.transform = pos + " rotate(" + angle.toFixed(1) + "deg)";
      if (halo) halo.style.transform = pos;
      if (labelPill) labelPill.style.transform = pos;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    var HOVERABLES = "[data-cursor], a[href], button, .btn";
    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest ? e.target.closest(HOVERABLES) : null;
      if (!t) return;
      root.classList.add("is-interactive");
      if (labelText) labelText.textContent = t.getAttribute("data-cursor") || "";
    });
    document.addEventListener("mouseout", function (e) {
      var t = e.target.closest ? e.target.closest(HOVERABLES) : null;
      if (t && (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(HOVERABLES))) {
        root.classList.remove("is-interactive");
        if (labelText) labelText.textContent = "";
      }
    });
  }

  /* -----------------------------------------------------------
     Magnetic buttons
     ----------------------------------------------------------- */
  function initMagnetic() {
    if (!fineHover) return;
    $$("[data-magnetic]").forEach(function (el) {
      var strength = parseFloat(el.dataset.magneticStrength || "0.3");
      var inner = document.createElement("span");
      inner.className = "magnetic-inner";
      while (el.firstChild) inner.appendChild(el.firstChild);
      el.appendChild(inner);
      el.classList.add("has-magnetic");
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        tx = ((e.clientX - r.left) - r.width / 2) * strength;
        ty = ((e.clientY - r.top) - r.height / 2) * strength;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      el.addEventListener("mouseleave", function () {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      function loop() {
        cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
        inner.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
        raf = (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) ? requestAnimationFrame(loop) : null;
      }
    });
  }

  /* -----------------------------------------------------------
     Hero photo tilt (CSS 3D, mouse-reactive, no WebGL)
     ----------------------------------------------------------- */
  function initHeroTilt() {
    var el = $("[data-tilt-hero]");
    if (!el || !fineHover) return;
    var MAX = 8;
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      tx = -py * MAX; ty = px * MAX;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    el.addEventListener("mouseleave", function () {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    function loop() {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      el.style.setProperty("--rx", cx.toFixed(2) + "deg");
      el.style.setProperty("--ry", cy.toFixed(2) + "deg");
      raf = (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) ? requestAnimationFrame(loop) : null;
    }
  }

  /* -----------------------------------------------------------
     Service / review card tilt on hover
     ----------------------------------------------------------- */
  function initCardTilt() {
    if (!fineHover) return;
    $$(".service-card").forEach(function (card) {
      var MAX = 4.5;
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        tx = -py * MAX; ty = px * MAX;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener("mouseleave", function () {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      function loop() {
        cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
        card.style.setProperty("--rx", cx.toFixed(2) + "deg");
        card.style.setProperty("--ry", cy.toFixed(2) + "deg");
        raf = (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) ? requestAnimationFrame(loop) : null;
      }
    });
  }

  /* -----------------------------------------------------------
     Hero parallax on scroll (GSAP) — differential ~18pt between
     the photo and the copy so they drift apart as you scroll.
     ----------------------------------------------------------- */
  function initHeroParallax() {
    if (!window.gsap || !window.ScrollTrigger) return;
    var fig = $(".hero-figure");
    var copy = $(".hero-copy");
    if (fig) {
      gsap.to(fig, {
        yPercent: -6, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }
    if (copy) {
      gsap.to(copy, {
        yPercent: -24, opacity: 0.4, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }
  }

  /* -----------------------------------------------------------
     Hero mist — a handful of soft, slow-drifting specks confined
     to the hero canvas. Purely atmospheric, so it's gated behind
     reduced-motion (unlike hover/tilt/reveal, which never are).
     ----------------------------------------------------------- */
  function initHeroMist() {
    var canvas = $("[data-hero-mist]");
    if (!canvas || reduced) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var hero = $(".hero");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [];
    var COUNT = 34;
    var w = 0, h = 0;

    function resize() {
      w = hero.offsetWidth; h = hero.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2.6,
        vx: (Math.random() - 0.5) * 0.09,
        vy: -0.05 - Math.random() * 0.16,
        a: 0.08 + Math.random() * 0.22,
      });
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.y < -8) { p.y = h + 8; p.x = Math.random() * w; }
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
        ctx.beginPath();
        ctx.fillStyle = "rgba(21,19,15," + p.a + ")";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* -----------------------------------------------------------
     Boot
     ----------------------------------------------------------- */
  function boot() {
    safe(initYear, "initYear");
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initReveals, "initReveals");
    safe(initCursor, "initCursor");
    safe(initMagnetic, "initMagnetic");
    safe(initHeroTilt, "initHeroTilt");
    safe(initCardTilt, "initCardTilt");
    safe(initHeroMist, "initHeroMist");

    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}
      safe(initSplitText, "initSplitText");
      safe(initHeroParallax, "initHeroParallax");
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
