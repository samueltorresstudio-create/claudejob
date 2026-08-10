# JS modules (`main.js`)

One IIFE, `"use strict"`, no globals leaked. Shared helpers at the top:
`$`, `$$`, `escHTML`, `safe(fn, name)`, plus two media-query booleans read
once — `reduced` (`prefers-reduced-motion`) and `fineHover`
(`(hover: hover) and (pointer: fine)`).

Everything hover- or pointer-driven is gated behind `fineHover` so touch
devices never pay for it. Only `initHeroMist` is gated behind `reduced`.

`boot()` runs every module through `safe()`, then adds `is-ready` to
`<html>`. GSAP-dependent modules run only if `window.gsap &&
window.ScrollTrigger`, after `gsap.registerPlugin(ScrollTrigger)`.

## Module reference

| Function | Hook | Notes |
|---|---|---|
| `initYear` | `[data-year]` | Footer copyright year |
| `initSplash` | `[data-splash]` | Adds `.is-out` on `load` +350ms; hard cap 3800ms |
| `initNav` | `[data-nav]`, `[data-nav-burger]`, `[data-nav-mobile]` | `.is-scrolled` past 60px; burger locks `documentElement.style.overflow` |
| `initSmoothAnchors` | delegated `a[href^="#"]` | 88px nav offset; `behavior: auto` under reduced-motion |
| `initSplitText` | `[data-split="chars\|words"]` | GSAP. Preserves `<br>` and inline tags, sets `aria-label` on the parent and `aria-hidden` on every fragment |
| `initReveals` | `[data-reveal]`, `[data-reveal-mask]` | IO at `threshold: 0.02`, `rootMargin: 0 0 -2% 0`; 6s catch-up sweep; masks revealed on `load`, never observed |
| `initCursor` | `[data-cursor-root]` | See below |
| `initMagnetic` | `[data-magnetic]` | Wraps children in `.magnetic-inner`; `data-magnetic-strength` default `0.3`, lerp `0.2` |
| `initHeroTilt` | `[data-tilt-hero]` | `MAX 8deg`, lerp `0.12`; writes `--rx`/`--ry` |
| `initCardTilt` | `.service-card` | `MAX 4.5deg`, lerp `0.15`; writes `--rx`/`--ry` |
| `initHeroParallax` | `.hero-figure`, `.hero-copy` | GSAP scrub. Photo `yPercent: -6`, copy `yPercent: -24` + `opacity: 0.4` — the ~18pt differential is the effect |
| `initHeroMist` | `[data-hero-mist]` canvas | 34 particles, `r 1–3.6`, `vy -0.05..-0.21`, alpha `0.08–0.30`, DPR capped at 2 |
| `initGalleryModal` | `[data-gallery]` → `[data-gallery-modal]` | See below |

## `initCursor`

Adds `.has-cursor` to `<html>` (which is what hides the native cursor —
so a touch device or a missing root element leaves the real cursor alone).

Three independently positioned children share one lerped position:

- `LERP_POS = 0.18` for position (0.15–0.2 is the usable range; 1.0 is
  indistinguishable from the native cursor and defeats the point).
- Rotation is lerped **separately** at `0.18` with shortest-path wrapping
  (`while (diff > 180) diff -= 360`), otherwise the arrow spins the long
  way round when crossing ±180°.
- `targetAngle` gets a `-45` offset to compensate the arrow glyph's own
  tip direction, and only updates when movement exceeds 0.4px so a resting
  cursor doesn't jitter.
- `.is-ready` is added on first `mousemove` — prevents the cursor flying
  in from `0,0` on load.

Hover state is delegated `mouseover`/`mouseout` against
`"[data-cursor], a[href], button, .btn"`, with a `relatedTarget` check so
moving between two children of the same target doesn't flicker. The
`data-cursor` attribute value becomes the label text.

## `initGalleryModal`

One modal instance in the DOM, opened with a slug read from the trigger's
`data-gallery`. Config comes from `window.__GALLERY__[slug]`:
`{ caption, folder, files: [] }`.

- **Slides** are built on open (`buildSlides`), with `data-src` rather than
  `src`; `loadWindow(i)` eagerly loads only `i`, `i+1`, `i-1`.
- **Chips**: filenames starting `antes-` / `despues-` get an
  "Antes"/"Después" chip; everything else hides it.
- **Transitions**: `translate3d` on the track,
  `.5s cubic-bezier(0.16,1,0.3,1)`, disabled (`transition: none`) during
  drag and on resize repositioning.
- **Swipe**: pointer events with `setPointerCapture`, commit threshold
  15% of stage width.
- **Keyboard**: Escape closes, Arrow left/right navigate, Tab is trapped
  (`getFocusable()` filters on `offsetParent !== null` so hidden arrows in
  single-photo mode aren't focusable).
- **Focus**: focuses the close button on open, restores `lastFocused` on
  close.
- **Scroll lock** via `documentElement.style.overflow`, cleared on close.
- Triggers respond to click **and** Enter/Space, since they are
  `<article role="button" tabindex="0">` rather than real buttons.
- `data-single` is toggled on `.gallery-modal-inner` when there is only
  one photo, which CSS uses to hide arrows and dots.

## Adding a module

```js
function initThing() {
  var el = $("[data-thing]");
  if (!el) return;          // always bail silently if the hook is absent
  if (!fineHover) return;   // if it is pointer-driven
  // ...transform/opacity only
}
```
Register it in `boot()` as `safe(initThing, "initThing")`.
