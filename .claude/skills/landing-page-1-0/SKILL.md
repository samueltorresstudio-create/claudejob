---
name: landing-page-1-0
description: Build a premium editorial landing page in the "Landing Page 1.0" system — the monochrome cream/ink design language, custom arrow cursor, cinematic hero, tilt cards, GSAP scroll reveals, "Explorar" photo-gallery modal, Google Maps embed and WhatsApp CTA first built for Nuovolaser. Static HTML/CSS/vanilla JS, no build step, drag-and-drop to Hostinger or any static host. Use when the user asks for a landing page for a local business (estética, clínica, restaurante, gimnasio, estudio, taller), asks to reuse "el diseño de Nuovolaser", or says "landing page 1.0", "haz una web como la de", "otra landing igual", "misma plantilla".
---

# Landing Page 1.0

A complete, production-proven system for single-page premium landings for
local businesses. Everything here has shipped: the reference implementation
in `reference-implementation/` is the real Nuovolaser site, verbatim.

Read this file, then copy the reference implementation and adapt it. Do not
rebuild from scratch — the value of this skill is the accumulated bug fixes
(see `references/gotchas.md`), not the markup.

## What this system is

- **Stack**: one `index.html`, one `styles.css`, one `main.js`, plus
  `lib/manifest.js` (content) and vendored GSAP. No npm, no build, no
  backend, no framework. Upload the folder, it works.
- **Look**: monochrome editorial — cream paper (`#f7f4ee`) and near-black
  ink (`#15130f`), zero accent colors. Serif display (Cormorant Garamond)
  over sans body (Inter). Generous whitespace, large type, thin rules.
- **Feel**: custom lerp-following arrow cursor with contextual labels,
  cinematic hero mask-reveal, ambient mist particles, 3D tilt on the hero
  photo and service cards, magnetic buttons, split-text word/char stagger,
  differential scroll parallax.
- **Conversion**: every CTA goes to WhatsApp (`wa.me`) with a prefilled
  message. No forms, no backend to maintain.

## Build order

1. **Gather from the user**: business name, tagline, address, phone,
   Google Place ID, services (name + 1-line description each), real
   photos, logo, opening hours, 3–6 review quotes.
2. **Copy the reference implementation** into the project root:
   `index.html`, `styles.css`, `main.js`, `lib/manifest.js`,
   `lib/gallery-manifest.js`.
3. **Vendor GSAP** — CDNs are often blocked in sandboxes:
   ```
   npm pack gsap@3.12.5 && tar -xzf gsap-3.12.5.tgz
   cp package/dist/gsap.min.js package/dist/ScrollTrigger.min.js lib/
   ```
4. **Process images** to `.webp`, max 1800px wide, quality ~82, into
   `assets/img/`. Descriptive kebab-case names (`tratamiento-laser.webp`).
   Exception: photos the user explicitly says not to touch — keep those
   byte-identical (see `references/gotchas.md`).
5. **Rewrite content**: `lib/manifest.js` first (it is the single source of
   truth for brand data), then the matching copy in `index.html`.
6. **Extract the logo** to transparent PNG/WebP in both black and white
   variants, plus `favicon.png` / `favicon.ico`.
7. **Verify** — see the checklist below.

## Section inventory

The page is always these sections, in this order. Drop what doesn't apply;
don't reorder (the tonal arc — arrival, offer, trust, space, proof,
location, close — is the design).

| Section | id | Purpose |
|---|---|---|
| Splash | `[data-splash]` | Logo fade, self-dismissing, 3.8s hard cap |
| Nav | `[data-nav]` | Transparent → solid on scroll, burger under 900px |
| Hero | `#hero` | Split-text title, mask-reveal photo, mist canvas, two CTAs |
| Servicios | `#servicios` | Tilt cards; some open the "Explorar" gallery modal |
| Por qué elegirnos | `#por-que-elegirnos` | 5 line-art SVG icons + copy |
| Galería | `#galeria` | Asymmetric masonry-ish grid of the real space |
| Opiniones | `#opiniones` | 5-star review cards |
| Ubicación | `#ubicacion` | Keyless Maps iframe + address/hours + directions |
| CTA final | `#reservar` | Dark inverted band, giant magnetic WhatsApp button |
| Footer | `#contacto` | Brand, address, hours, phone, WhatsApp |
| Gallery modal | `[data-gallery-modal]` | One reusable instance, driven by JS |

Details, markup and CSS for each: `references/sections.md`.

## Non-negotiables

These are load-bearing. Breaking any of them reintroduces a bug that was
already found and fixed once.

- **Cursor base color is pure white `#fff`** with `mix-blend-mode:
  difference`. Any other color goes invisible on the dark CTA band.
- **The label pill and its text are separate elements**, each with its own
  `mix-blend-mode: difference`. Merging them makes the text white-on-white.
- **`<html class="js">` is set by a blocking inline script in `<head>`**,
  and every hidden-until-revealed rule is scoped under `.js`. Without it,
  a JS failure leaves a blank page.
- **Never `IntersectionObserver` a `clip-path`-clipped element on itself** —
  it reports zero intersection area and never fires. Reveal masks on `load`
  with a timer, plus a CSS `@keyframes` safety net.
- **Animate only `transform` and `opacity`.** No layout-property animation.
- **`prefers-reduced-motion` gates only ambient effects** (mist particles).
  Hover, tilt and reveal stay on — disabling them makes the site feel broken.
- **Every init runs through `safe(fn, name)`** so one failure can't take
  down the rest of the page.
- **Cache-bust CSS and JS** with `?v=YYYYMMDD` on every deploy.

## Content data model

`lib/manifest.js` sets `window.__BRAND__` — name, tagline, phone, WhatsApp
URL, address, hours, services, whyUs, gallery, reviews.
`lib/gallery-manifest.js` sets `window.__GALLERY__` — per-service photo
arrays for the "Explorar" modal.

A static site cannot list a folder at runtime. `__GALLERY__` is the manual
equivalent: adding photos means adding filenames to the array. Tell the
user this explicitly — they will otherwise expect drag-and-drop to work.
Filenames prefixed `antes-` / `despues-` automatically get an
"Antes"/"Después" chip in the carousel.

## Reference files

- `references/sections.md` — markup + CSS recipe per section
- `references/js-modules.md` — what each `init*()` in `main.js` does and its tuning constants
- `references/gotchas.md` — the bugs already paid for; read before debugging anything
- `reference-implementation/` — the real shipped Nuovolaser files

## Verification checklist

Serve locally (`python3 -m http.server 8765`) and check with a headless
browser at 1440px and 390px:

- [ ] Zero console errors; `document.documentElement.classList` contains `is-ready`
- [ ] Splash disappears within 4s
- [ ] Hero photo mask reveals; title words stagger in
- [ ] Cursor visible on cream **and** on the dark CTA band; label legible
- [ ] Service card hover tilts; "Explorar" cards open the modal
- [ ] Modal: arrows, dots, swipe, Escape, click-outside, Tab stays trapped
- [ ] Maps iframe renders (cannot be tested from a sandbox — google.com is
      usually blocked; verify on the real deployment)
- [ ] Every WhatsApp link opens `wa.me` with the prefilled message
- [ ] With JS disabled, all content is still visible
- [ ] No horizontal scroll at 390px
