/* =============================================================
   Nuovolaser — "El otro lado de la puerta"
   Plain vanilla JS. One IIFE, one pointer loop, one scroll handler.
   ============================================================= */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; };
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }

  var mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  var mqFine = matchMedia("(hover: hover) and (pointer: fine)");
  var reduced = function () { return mqReduce.matches; };

  /* Seeded generator, so the "random" offsets are identical on every load. */
  function rng(seed) {
    var s = seed >>> 0;
    return function () { return (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  }

  /* -----------------------------------------------------------
     Small page furniture
     ----------------------------------------------------------- */
  function initYear() {
    var el = $("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  function initNav() {
    var nav = $("[data-nav]");
    if (nav) {
      onScrollFns.push(function () {
        var heroEl = document.querySelector("[data-hero]");
        var heroBottom = heroEl ? heroEl.offsetHeight : 0;
        // light bar while it sits over the dark hero, solid cream once past it
        var over = window.scrollY < heroBottom - 84;
        var solid = !over && window.scrollY > 60;
        if (over !== nav._over) { nav._over = over; nav.classList.toggle("over-hero", over); }
        if (solid !== nav._solid) { nav._solid = solid; nav.classList.toggle("is-solid", solid); }
      });
    }
    var burger = $("[data-nav-burger]"), mobile = $("[data-nav-mobile]");
    if (!burger || !mobile) return;
    var toggle = function (open) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      mobile.setAttribute("aria-hidden", open ? "false" : "true");
      document.documentElement.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () {
      toggle(burger.getAttribute("aria-expanded") !== "true");
    });
    $$("a", mobile).forEach(function (a) { a.addEventListener("click", function () { toggle(false); }); });
  }

  function initAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 84,
        behavior: reduced() ? "auto" : "smooth"
      });
    });
  }

  /* Everything stops on a hidden tab. */
  function initPause() {
    document.addEventListener("visibilitychange", function () {
      document.body.classList.toggle("paused", document.hidden);
    });
  }

  /* Honest opening-hours readout, from the visitor's own clock. */
  function initOpenNow() {
    var el = $("[data-open-now]");
    if (!el) return;
    var d = new Date(), day = d.getDay(), mins = d.getHours() * 60 + d.getMinutes();
    var open = (day >= 1 && day <= 5 && mins >= 600 && mins < 1200) ||
               (day === 6 && mins >= 600 && mins < 840);
    el.textContent = open ? "Abierto ahora" : "Cerrado ahora";
    el.setAttribute("data-state", open ? "open" : "closed");
    el.hidden = false;
  }

  /* -----------------------------------------------------------
     One shared pointer loop: cursor, magnets, tilt, spotlight.
     Off-screen elements are not in the active Sets, so they cost zero.
     ----------------------------------------------------------- */
  var P = { x: 0, y: 0, tx: 0, ty: 0 };
  var pRaf = null, idle = 0;
  var activeMagnets = new Set(), activeTilts = new Set(), activeSpots = new Set();
  var cur = null, curDot = null, curRing = null;

  function pTick() {
    var k = 0.18;
    P.x += (P.tx - P.x) * k;
    P.y += (P.ty - P.y) * k;

    if (cur) {
      curDot.style.setProperty("--x", P.tx + "px");
      curDot.style.setProperty("--y", P.ty + "px");
      curRing.style.setProperty("--x", P.x.toFixed(1) + "px");
      curRing.style.setProperty("--y", P.y.toFixed(1) + "px");
    }
    activeMagnets.forEach(updateMagnet);
    activeTilts.forEach(updateTilt);
    activeSpots.forEach(updateSpot);

    var settled = Math.abs(P.tx - P.x) < 0.1 && Math.abs(P.ty - P.y) < 0.1;
    if (settled && ++idle > 30) { pRaf = null; return; }
    pRaf = requestAnimationFrame(pTick);
  }

  function onPointerMove(e) {
    P.tx = e.clientX; P.ty = e.clientY; idle = 0;
    if (pRaf === null) pRaf = requestAnimationFrame(pTick);
  }

  function updateMagnet(el) {
    var r = el.getBoundingClientRect();
    var dx = P.tx - (r.left + r.width / 2), dy = P.ty - (r.top + r.height / 2);
    var dist = Math.hypot(dx, dy), reach = Math.max(r.width, r.height) * 1.15;
    var pull = dist > reach ? 0 : (1 - dist / reach) * 0.32;
    var x = (dx * pull).toFixed(2), y = (dy * pull).toFixed(2);
    if (el._mx === x && el._my === y) return;
    el._mx = x; el._my = y;
    el.style.setProperty("--mx", x + "px");
    el.style.setProperty("--my", y + "px");
  }

  function updateTilt(el) {
    var r = el.getBoundingClientRect();
    var px = (P.tx - r.left) / r.width, py = (P.ty - r.top) / r.height;
    if (px < 0 || px > 1 || py < 0 || py > 1) {
      if (el._tilt !== 0) { el._tilt = 0; el.style.setProperty("--tilt", 0); el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); }
      return;
    }
    el._tilt = 1;
    el.style.setProperty("--tilt", 1);
    el.style.setProperty("--rx", ((0.5 - py) * 5).toFixed(2) + "deg");
    el.style.setProperty("--ry", ((px - 0.5) * 5).toFixed(2) + "deg");
    el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
    el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
  }

  function updateSpot(el) {
    var r = el.getBoundingClientRect();
    var gx = (((P.tx - r.left) / r.width) * 100).toFixed(1);
    var gy = (((P.ty - r.top) / r.height) * 100).toFixed(1);
    if (el._gx === gx && el._gy === gy) return;
    el._gx = gx; el._gy = gy;
    el.style.setProperty("--gx", gx + "%");
    el.style.setProperty("--gy", gy + "%");
  }

  function watchSet(sel, set) {
    var els = $$(sel);
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? set.add(e.target) : set.delete(e.target); });
    }, { rootMargin: "10% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  var pointerArmed = false;
  function armPointer() {
    if (pointerArmed || !mqFine.matches || reduced()) return;
    pointerArmed = true;
    cur = $("[data-cur-root]");
    if (cur) {
      curDot = $(".cur-dot", cur); curRing = $(".cur-ring", cur);
      document.documentElement.classList.add("cur-on");
      document.addEventListener("pointerover", function (e) {
        var t = e.target.closest ? e.target.closest("[data-cur]") : null;
        var cls = "cur" + (t ? " is-" + t.dataset.cur : "");
        if (cur.className !== cls) cur.className = cls;
      });
    }
    watchSet("[data-magnet]", activeMagnets);
    watchSet("[data-tilt]", activeTilts);
    watchSet("[data-spot]", activeSpots);
    addEventListener("pointermove", onPointerMove, { passive: true });
  }

  function disarmPointer() {
    if (!pointerArmed) return;
    pointerArmed = false;
    removeEventListener("pointermove", onPointerMove);
    if (pRaf !== null) { cancelAnimationFrame(pRaf); pRaf = null; }
    document.documentElement.classList.remove("cur-on");
    activeMagnets.clear(); activeTilts.clear(); activeSpots.clear();
  }

  /* -----------------------------------------------------------
     Reveals and scroll-linked section progress
     ----------------------------------------------------------- */
  var onScrollFns = [];

  function initReveals() {
    var els = $$("[data-reveal]");
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.02, rootMargin: "0px 0px -2% 0px" });
    els.forEach(function (el) { io.observe(el); });
    // safety net: anything still hidden after 6s that is already on screen
    setTimeout(function () {
      $$("[data-reveal]:not(.in)").forEach(function (el) {
        if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in");
      });
    }, 6000);
  }

  function initSectionProgress() {
    var secs = $$("[data-sec]");
    if (!secs.length) return;
    var live = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? live.add(e.target) : live.delete(e.target); });
    }, { rootMargin: "10% 0px" });
    secs.forEach(function (s) { io.observe(s); });

    onScrollFns.push(function () {
      live.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var p = clamp(1 - r.bottom / (innerHeight + r.height), 0, 1);
        if (Math.abs((el._p || 0) - p) < 0.005) return;
        el._p = p;
        el.style.setProperty("--p", p.toFixed(3));
      });
    });
  }

  /* -----------------------------------------------------------
     Proof wall: duplicate each lane until it clears the widest screen
     ----------------------------------------------------------- */
  function initWall() {
    $$("[data-lane]").forEach(function (lane) {
      var originals = $$(".quote", lane);
      if (!originals.length) return;
      var guard = 0;
      while (lane.scrollWidth < 2560 && guard++ < 12) {
        originals.forEach(function (q) {
          var c = q.cloneNode(true);
          c.setAttribute("aria-hidden", "true");
          lane.appendChild(c);
        });
      }
      // one exact duplicate more, so translate3d(-50%) loops seamlessly
      $$(".quote", lane).slice().forEach(function (q) {
        var c = q.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        lane.appendChild(c);
      });
    });
  }

  /* -----------------------------------------------------------
     THE HERO SCRUB
     ----------------------------------------------------------- */
  /* Two encodes of the same shot. H.264 is what virtually every browser wants,
     but Chromium builds without proprietary codecs (common on Linux) cannot
     decode it at all, and a bare mp4 there fails with no visible reason.
     Pick the one the browser actually claims it can play. */
  var SOURCES = [
    { url: "assets/hero-scrub.mp4",  bytes: 4807425, type: 'video/mp4; codecs="avc1.42E01E"' },
    { url: "assets/hero-scrub.webm", bytes: 3554327, type: 'video/webm; codecs="vp9"' }
  ];
  var VIDEO_URL = SOURCES[0].url;
  var VIDEO_BYTES = SOURCES[0].bytes;
  var POSTER_URL = "assets/hero-poster.jpg";

  function pickSource(v) {
    for (var i = 0; i < SOURCES.length; i++) {
      if (v.canPlayType(SOURCES[i].type)) return SOURCES[i];
    }
    return SOURCES[0];
  }

  var hero, sticky, stage, video, posterLayer, loader, ring, cue, bands = [];
  var target = 0, shown = 0, rafId = null, lastTick = 0, heroOnScreen = true;
  var seekBusy = false, pendingTime = null;
  var heroInit = false, scrubOn = false, blobStarted = false;

  function heroProgress() {
    if (!hero) return 0;
    var range = hero.offsetHeight - innerHeight;
    if (range <= 0) return 0;
    return clamp(-hero.getBoundingClientRect().top / range, 0, 1);
  }

  function requestSeek(t) {
    if (!video || !video.duration) return;
    if (seekBusy) { pendingTime = t; return; }
    seekBusy = true;
    video.currentTime = t;
  }

  /* --- band text splitting, done once --- */
  function buildBands() {
    bands = $$("[data-band]").map(function (el) {
      var a = parseFloat(el.dataset.a), b = parseFloat(el.dataset.b);
      var fx = el.dataset.fx;
      var ramp = el.dataset.ramp ? parseFloat(el.dataset.ramp) : Math.min(0.025, (b - a) * 0.35);
      var title = $("[data-split]", el);
      if (title) fx === "blur" ? buildBlurTitle(title) : splitWords(title, fx, a);
      return { el: el, a: a, b: b, ramp: ramp, op: -1, k: -1 };
    });
  }

  function splitWords(el, fx, seedBase) {
    var text = el.textContent.trim().replace(/\s+/g, " ");
    var words = text.split(" ");
    var rnd = rng(Math.round((seedBase + 1) * 99991));
    var sr = document.createElement("span");
    sr.className = "sr";
    sr.textContent = text;
    var vis = document.createElement("span");
    vis.setAttribute("aria-hidden", "true");
    var mid = (words.length - 1) / 2;
    words.forEach(function (w, i) {
      var s = document.createElement("span");
      s.className = "w";
      s.textContent = w;
      var th = (i / Math.max(1, words.length)) * 0.5 + rnd() * 0.06;
      s.style.setProperty("--th", th.toFixed(3));
      if (fx === "part") {
        var side = i <= mid ? -1 : 1;
        s.style.setProperty("--jx", (side * (26 + rnd() * 22)).toFixed(0) + "px");
      }
      vis.appendChild(s);
      if (i < words.length - 1) vis.appendChild(document.createTextNode(" "));
    });
    el.textContent = "";
    el.appendChild(sr);
    el.appendChild(vis);
  }

  /* Blur-to-sharp: two stacked copies crossfaded by opacity only.
     The soft copy carries a STATIC blur; filter itself is never animated. */
  function buildBlurTitle(el) {
    var text = el.textContent.trim().replace(/\s+/g, " ");
    el.textContent = "";
    var wrap = document.createElement("span");
    wrap.className = "bt";
    var soft = document.createElement("span");
    soft.className = "bt-soft";
    soft.setAttribute("aria-hidden", "true");
    soft.textContent = text;
    var sharp = document.createElement("span");
    sharp.className = "bt-sharp";
    sharp.textContent = text;
    wrap.appendChild(soft);
    wrap.appendChild(sharp);
    el.appendChild(wrap);
  }

  var smoothstep = function (p, e0, e1) {
    var t = clamp((p - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  var loadK = 0, loadStart = 0;
  function updateCaptions(p) {
    for (var i = 0; i < bands.length; i++) {
      var bd = bands[i];
      var f = Math.min(0.02, (bd.b - bd.a) / 3);
      var inEdge = i === 0 ? 1 : smoothstep(p, bd.a, bd.a + f);
      var outEdge = i === bands.length - 1 ? 1 : (1 - smoothstep(p, bd.b - f, bd.b));
      var op = inEdge * outEdge;
      var k = clamp((p - bd.a) / bd.ramp, 0, 1);
      if (i === 0) k = Math.max(k, loadK);       // band one opens settled
      if (op < 0.002) op = 0;
      if (Math.abs(bd.op - op) > 0.004 || (op === 0 && bd.op !== 0)) { bd.op = op; bd.el.style.opacity = op.toFixed(3); }
      if (Math.abs(bd.k - k) > 0.008) { bd.k = k; bd.el.style.setProperty("--k", k.toFixed(3)); }
    }
    if (cue) {
      var gone = p > 0.06;
      if (gone !== cue._gone) { cue._gone = gone; cue.classList.toggle("is-gone", gone); }
    }
  }

  function tick(now) {
    var dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    var k = 0.16;
    shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
    if (Math.abs(target - shown) < 0.0005) { shown = target; rafId = null; lastTick = 0; }
    else rafId = requestAnimationFrame(tick);
    if (video && video.duration) requestSeek(shown * video.duration);
    updateCaptions(shown);
  }

  function onHeroScroll() {
    target = heroProgress();
    if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
  }

  function failVideo() {
    if (stage) stage.classList.add("video-failed");
    if (loader) {
      loader.classList.add("is-done");
      loader.innerHTML = '<span class="loader-cue"></span>';
    }
  }

  async function loadHeroBlob() {
    var ctrl = new AbortController();
    var watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
    var src = pickSource(video);
    VIDEO_URL = src.url; VIDEO_BYTES = src.bytes;
    var res = await fetch(VIDEO_URL, { signal: ctrl.signal });
    if (!res.ok || !res.body) throw new Error("video " + res.status);
    var total = Number(res.headers.get("Content-Length")) || VIDEO_BYTES;
    var reader = res.body.getReader();
    var chunks = [], got = 0, lastRing = 0;
    for (;;) {
      var r = await reader.read();
      if (r.done) break;
      clearTimeout(watchdog);
      watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
      chunks.push(r.value);
      got += r.value.length;
      var frac = Math.min(1, got / total);
      var now = performance.now();
      if (now - lastRing > 100 || frac === 1) {
        lastRing = now;
        if (ring) ring.style.setProperty("--ld", Math.round(126 * (1 - frac)));
      }
    }
    clearTimeout(watchdog);
    if (ring) ring.style.setProperty("--ld", 0);
    video.src = URL.createObjectURL(new Blob(chunks, { type: src.type.split(";")[0] }));
    video.preload = "auto";   // "none" in the markup keeps gated devices off the
    video.load();             // network; the blob is here now, so let it decode
    video.addEventListener("loadeddata", function () {
      requestSeek(heroProgress() * video.duration);
      stage.classList.add("video-ready");
      if (loader) loader.classList.add("is-done");
    }, { once: true });
  }

  function startBlobFetch() {
    if (blobStarted) return;
    blobStarted = true;
    loadHeroBlob().catch(failVideo);
  }

  function initHeroOnce() {
    if (heroInit) return;
    heroInit = true;

    // The poster wins the bandwidth race by design: paint it, then stream the video.
    posterLayer.style.backgroundImage = "url('" + POSTER_URL + "')";
    var img = new Image();
    img.onload = startBlobFetch;
    img.onerror = startBlobFetch;
    img.src = POSTER_URL;
    setTimeout(startBlobFetch, 4000);

    video.addEventListener("seeked", function () {
      seekBusy = false;
      if (pendingTime !== null) { var t = pendingTime; pendingTime = null; requestSeek(t); }
    });
    video.addEventListener("error", function () {   // the deadlock escape
      seekBusy = false; pendingTime = null; failVideo();
    });

    // band one assembles once on load, then hands over to scroll
    loadStart = performance.now();
    (function ramp() {
      loadK = clamp((performance.now() - loadStart) / 900, 0, 1);
      updateCaptions(shown);
      if (loadK < 1) requestAnimationFrame(ramp);
    })();

    new IntersectionObserver(function (e) {
      heroOnScreen = e[0].isIntersecting;
      if (heroOnScreen && rafId === null && scrubOn) rafId = requestAnimationFrame(tick);
    }, { rootMargin: "20% 0px" }).observe(hero);
  }

  /* --- the five static-hero gates, decided live, never once at load --- */
  var GATES = [
    "(max-width: 720px)",
    "(orientation: portrait) and (max-width: 1024px)",
    "(orientation: portrait) and (pointer: coarse)",
    "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
    "(prefers-reduced-motion: reduce)"
  ];
  var MQLS = GATES.map(function (q) { return matchMedia(q); });

  function enableScrub() {
    if (scrubOn || !hero) return;
    scrubOn = true;
    initHeroOnce();
    bands.forEach(function (b) { b.op = -1; b.k = -1; });
    unpinFinalStates();
    onHeroScroll();
    updateCaptions(heroProgress());
  }

  function disableScrub() {
    if (!scrubOn) return;
    scrubOn = false;
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function applyHeroMode() {
    if (MQLS.some(function (m) { return m.matches; })) { disableScrub(); disarmPointer(); }
    else { enableScrub(); armPointer(); }
  }

  /* Reduced motion, honored live in BOTH directions. */
  function pinToFinalStates() {
    $$("[data-reveal]").forEach(function (el) { el.classList.add("in"); });
    $$("[data-sec]").forEach(function (el) { el.style.setProperty("--p", 1); });
    var door = $("[data-door]");
    if (door) { door.style.setProperty("--open", 1); door.classList.add("is-open"); }
    disableScrub();
    disarmPointer();
  }
  function unpinFinalStates() {
    $$("[data-sec]").forEach(function (el) { el._p = null; el.style.removeProperty("--p"); });
    var door = $("[data-door]");
    if (door && !door._done) { door.style.removeProperty("--open"); door.classList.remove("is-open"); }
  }

  function initHero() {
    hero = $("[data-hero]");
    if (!hero) return;
    sticky = $(".hero-sticky", hero);
    stage = $("[data-stage]");
    video = $("[data-video]");
    posterLayer = $("[data-poster]");
    loader = $("[data-loader]");
    ring = loader ? $(".ring circle", loader) : null;
    cue = $("[data-cue]");
    buildBands();
    onScrollFns.push(onHeroScroll);
    MQLS.forEach(function (m) { m.addEventListener("change", applyHeroMode); });
  }

  /* -----------------------------------------------------------
     The signature interaction: push the door open
     ----------------------------------------------------------- */
  function initDoor() {
    var door = $("[data-door]");
    var hold = $("[data-door-hold]");
    if (!door || !hold) return;

    if (reduced()) { door.style.setProperty("--open", 1); door.classList.add("is-open"); door._done = true; return; }

    var v = 0, holding = false, raf = null;

    function loop() {
      var to = holding ? 1 : 0;
      var rate = holding ? 0.022 : 0.03;
      v += (to - v) * (rate * 3);
      if (holding && v > 0.985) v = 1;
      if (!holding && v < 0.004) v = 0;
      door.style.setProperty("--open", v.toFixed(3));
      hold.style.setProperty("--hold", v.toFixed(3));
      if (v === 1) {
        door.classList.add("is-open");
        door._done = true;
        raf = null;
        return;
      }
      if (v === 0 && !holding) { raf = null; return; }
      raf = requestAnimationFrame(loop);
    }
    function start(e) {
      if (door._done) return;
      if (e && e.preventDefault) e.preventDefault();
      holding = true;
      if (raf === null) raf = requestAnimationFrame(loop);
    }
    function stop() {
      holding = false;
      if (raf === null && !door._done) raf = requestAnimationFrame(loop);
    }

    hold.addEventListener("pointerdown", start);
    addEventListener("pointerup", stop);
    addEventListener("pointercancel", stop);
    hold.addEventListener("pointerleave", stop);
    hold.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") start(e);
    });
    hold.addEventListener("keyup", function (e) {
      if (e.key === "Enter" || e.key === " ") stop();
    });
    hold.addEventListener("blur", stop);
  }

  /* -----------------------------------------------------------
     The photo gallery
     ----------------------------------------------------------- */
  function initGallery() {
    var triggers = $$("[data-gallery]");
    var modal = $("[data-gal]");
    if (!triggers.length || !modal) return;

    var data = window.__GALLERY__ || {};
    var track = $("[data-gal-track]", modal), stageEl = $("[data-gal-stage]", modal);
    var chip = $("[data-gal-chip]", modal), caption = $("[data-gal-caption]", modal);
    var dots = $("[data-gal-dots]", modal), inner = $(".gal-inner", modal);
    var prev = $("[data-gal-prev]", modal), next = $("[data-gal-next]", modal);
    var current = null, index = 0, slides = [], lastFocused = null;
    var dragging = false, dragX = 0, dragD = 0, sw = 0;

    var chipFor = function (f) {
      var l = f.toLowerCase();
      if (l.indexOf("antes-") === 0) return "Antes";
      if (l.indexOf("despues-") === 0) return "Después";
      return null;
    };
    function loadSlide(i) {
      var el = slides[i];
      if (!el) return;
      var img = el.querySelector("img[data-src]");
      if (img) { img.src = img.getAttribute("data-src"); img.removeAttribute("data-src"); }
    }
    function loadWindow(i) {
      var n = slides.length;
      loadSlide(i); loadSlide((i + 1) % n); loadSlide((i - 1 + n) % n);
    }
    function update(animate) {
      sw = stageEl.offsetWidth;
      track.style.transition = animate ? "transform .5s cubic-bezier(0.16,1,0.3,1)" : "none";
      track.style.transform = "translate3d(" + (-index * sw) + "px,0,0)";
      slides.forEach(function (el, i) { el.classList.toggle("is-active", i === index); });
      loadWindow(index);
      var c = chipFor(current.files[index]);
      if (c) { chip.textContent = c; chip.hidden = false; } else { chip.hidden = true; }
      $$("button", dots).forEach(function (d, i) { d.classList.toggle("is-active", i === index); });
    }
    function goTo(i) {
      var n = slides.length;
      index = ((i % n) + n) % n;
      update(true);
    }
    function build() {
      track.innerHTML = ""; dots.innerHTML = "";
      slides = current.files.map(function (f, i) {
        var s = document.createElement("div");
        s.className = "gal-slide";
        var img = document.createElement("img");
        img.setAttribute("data-src", current.folder + f);
        img.alt = current.caption + ", foto " + (i + 1);
        s.appendChild(img);
        track.appendChild(s);
        var d = document.createElement("button");
        d.type = "button";
        d.setAttribute("aria-label", "Ir a la foto " + (i + 1));
        d.addEventListener("click", function () { goTo(i); });
        dots.appendChild(d);
        return s;
      });
      inner.toggleAttribute("data-single", current.files.length <= 1);
    }
    function focusable() {
      return $$('button, [href], [tabindex]:not([tabindex="-1"])', modal)
        .filter(function (el) { return el.offsetParent !== null; });
    }
    function onKey(e) {
      if (e.key === "Escape") return close();
      if (e.key === "ArrowRight") return goTo(index + 1);
      if (e.key === "ArrowLeft") return goTo(index - 1);
      if (e.key === "Tab") {
        var f = focusable();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    function down(e) { dragging = true; dragX = e.clientX; dragD = 0; sw = stageEl.offsetWidth; track.style.transition = "none"; if (stageEl.setPointerCapture) stageEl.setPointerCapture(e.pointerId); }
    function move(e) { if (!dragging) return; dragD = e.clientX - dragX; track.style.transform = "translate3d(" + (-index * sw + dragD) + "px,0,0)"; }
    function up() {
      if (!dragging) return;
      dragging = false;
      var t = sw * 0.15;
      if (dragD > t) goTo(index - 1);
      else if (dragD < -t) goTo(index + 1);
      else update(true);
    }
    function open(slug, trigger) {
      var cfg = data[slug];
      if (!cfg || !cfg.files || !cfg.files.length) return;
      current = cfg; index = 0;
      lastFocused = trigger || document.activeElement;
      caption.textContent = cfg.caption || "";
      build();
      modal.setAttribute("aria-hidden", "false");
      modal.classList.add("is-open");
      document.documentElement.style.overflow = "hidden";
      document.addEventListener("keydown", onKey);
      stageEl.addEventListener("pointerdown", down);
      stageEl.addEventListener("pointermove", move);
      stageEl.addEventListener("pointerup", up);
      stageEl.addEventListener("pointercancel", up);
      requestAnimationFrame(function () {
        update(false);
        // focus only once the modal is actually visible: calling focus() in the
        // same tick as the class flip lands while it is still hidden, and the
        // focus silently goes nowhere, which leaves the trap with nothing to trap
        var c = $(".gal-close", modal);
        if (c) c.focus();
      });
    }
    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      stageEl.removeEventListener("pointerdown", down);
      stageEl.removeEventListener("pointermove", move);
      stageEl.removeEventListener("pointerup", up);
      stageEl.removeEventListener("pointercancel", up);
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    triggers.forEach(function (el) {
      el.addEventListener("click", function () { open(el.getAttribute("data-gallery"), el); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(el.getAttribute("data-gallery"), el); }
      });
    });
    $$("[data-gal-close]", modal).forEach(function (el) { el.addEventListener("click", close); });
    if (prev) prev.addEventListener("click", function () { goTo(index - 1); });
    if (next) next.addEventListener("click", function () { goTo(index + 1); });
    addEventListener("resize", function () { if (modal.classList.contains("is-open")) update(false); });
  }

  /* -----------------------------------------------------------
     Boot: one scroll handler for every scroll-driven thing
     ----------------------------------------------------------- */
  function runScroll() { for (var i = 0; i < onScrollFns.length; i++) onScrollFns[i](); }

  function boot() {
    safe(initYear, "year");
    safe(initNav, "nav");
    safe(initAnchors, "anchors");
    safe(initPause, "pause");
    safe(initOpenNow, "openNow");
    safe(initReveals, "reveals");
    safe(initSectionProgress, "sectionProgress");
    safe(initWall, "wall");
    safe(initHero, "hero");
    safe(initDoor, "door");
    safe(initGallery, "gallery");

    addEventListener("scroll", runScroll, { passive: true });
    addEventListener("resize", runScroll, { passive: true });

    safe(applyHeroMode, "heroMode");
    runScroll();

    mqReduce.addEventListener("change", function (e) {
      if (e.matches) pinToFinalStates();
      else applyHeroMode();
    });
    mqFine.addEventListener("change", function () {
      mqFine.matches && !reduced() ? armPointer() : disarmPointer();
    });

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
