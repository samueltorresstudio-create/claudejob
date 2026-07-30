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

    var ring = $(".cursor-ring", root);
    var dot = $(".cursor-dot", root);
    var label = $("[data-cursor-label]", root);
    var tx = 0, ty = 0, rx = 0, ry = 0, firstMove = false;

    window.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (dot) dot.style.transform = "translate3d(" + tx + "px," + ty + "px,0)";
      if (!firstMove) {
        firstMove = true;
        rx = tx; ry = ty;
        if (ring) ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
        root.classList.add("is-ready");
      }
    }, { passive: true });

    function tick() {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      if (ring) ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    var HOVERABLES = "[data-cursor], a[href], button, .btn";
    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest ? e.target.closest(HOVERABLES) : null;
      if (!t) return;
      root.classList.add("is-interactive");
      if (label) label.textContent = t.getAttribute("data-cursor") || "";
    });
    document.addEventListener("mouseout", function (e) {
      var t = e.target.closest ? e.target.closest(HOVERABLES) : null;
      if (t && (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(HOVERABLES))) {
        root.classList.remove("is-interactive");
        if (label) label.textContent = "";
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
     Hero parallax on scroll (GSAP)
     ----------------------------------------------------------- */
  function initHeroParallax() {
    if (!window.gsap || !window.ScrollTrigger) return;
    var fig = $(".hero-figure");
    var copy = $(".hero-copy");
    if (fig) {
      gsap.to(fig, {
        yPercent: 8, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }
    if (copy) {
      gsap.to(copy, {
        yPercent: -12, opacity: 0.4, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }
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
