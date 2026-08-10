# Sections, tokens and CSS structure

Full working markup and CSS: `../reference-implementation/`. This file is
the map — what each part does and what you must change per project.

## Design tokens

Everything derives from these. Change the palette here and the whole page
follows; never hardcode a color in a component rule.

```css
:root {
  --bg:        #f7f4ee;   /* cream paper */
  --bg-2:      #efe9dc;   /* alternating band */
  --paper:     #ffffff;
  --ink:       #15130f;   /* near-black, never pure #000 */
  --ink-soft:  #2d2a24;   /* body text */
  --ink-mute:  #6f6a5e;   /* eyebrows, em, secondary */
  --cream:     #f7f4ee;
  --cream-mute: rgba(247,244,238,0.7);
  --line:      rgba(21,19,15,0.12);
  --line-soft: rgba(21,19,15,0.07);

  --serif: "Cormorant Garamond", "Times New Roman", serif;
  --sans:  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;

  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);   /* the house ease */
  --ease-in:     cubic-bezier(0.7, 0, 0.84, 0);
  --ease-soft:   cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  --nav-h: 88px;
}
```

Rules of the palette: **no accent color**. Contrast comes from the
cream/ink inversion on the CTA band, not from hue. If a client insists on
a brand color, use it on at most one element and keep everything else
monochrome — the restraint is the whole look.

Type scale is fluid: `clamp(2.1rem, 4.4vw, 3.6rem)` for section titles,
larger for the hero. `text-wrap: balance` on headings, `pretty` on
paragraphs.

## CSS file order

Keep these numbered sections in this order — later rules depend on earlier
tokens and utilities.

1. Tokens · 2. Reset & base · 3. Utilities (`.container`, `.eyebrow`,
`.section-title`, `.skip-link`) · 4. Reveal/split defensive rules ·
5. Custom cursor · 6. Splash · 7. Buttons · 8. Nav · 9. Hero ·
10. Services · 11. Why us · 12. Gallery · 13. Reviews · 14. CTA final ·
15. Footer (incl. 15.5 gallery modal) · 16. Reduced motion.

Section 16 turns off **only** ambient motion. Do not add hover, tilt or
reveal rules to it.

## Per-section notes

### Splash
Full-bleed cream panel with the logo, `.is-out` fades it. CSS carries an
independent 4.5s fallback animation so a JS failure can't trap the page
behind it.

### Nav
Fixed, transparent, `backdrop-filter` + border appear with `.is-scrolled`.
Logo is a **wordmark image plus a separate live-text tagline** — do not
bake the tagline into the image, it can't be edited or translated later.
Burger below 900px opens `.nav-mobile` (`aria-hidden` toggled, scroll
locked).

### Hero
```
<canvas data-hero-mist>            ambient particles, behind everything
.hero-grid
  .hero-copy      eyebrow / h1 (3 lines, data-split) / sub / 2 CTAs
  .hero-figure    [data-tilt-hero] > .reveal-mask[data-reveal-mask] > img
.hero-scroll-cue
```
The title is three spans: script-serif brand name (`data-split="chars"`),
then two caps lines (`data-split="words"`), the second muted. The photo
gets `fetchpriority="high"`, `loading="eager"` and a `<link rel="preload">`
in `<head>`. Mask starts `clip-path: inset(0 0 100% 0)` with the image at
`scale(1.3)` + `blur(16px)`, settling over 1.2s `var(--ease-out)` — that
combination is the "cinematic" entrance.

### Servicios
`.services-grid` of `<article class="service-card">`, each with
`data-cursor="Explorar"`. Cards that have real photos get
`has-gallery`, `data-gallery="<slug>"`, `role="button"`, `tabindex="0"`,
`aria-haspopup="dialog"`, an explicit `aria-label`, and a visible
`.service-card-explore` affordance. Tilt via `--rx`/`--ry` custom
properties written by JS.

### Por qué elegirnos
Five items, each an inline line-art SVG (`stroke="currentColor"`,
`stroke-width="1.2"`, `fill="none"`, 40×40 viewBox) + h3 + p. Inline the
SVGs — icon fonts and sprite files are not worth the request.

### Galería
Asymmetric CSS grid; `.gallery-item-lg` and `.gallery-item-wide` break the
rhythm. Images `loading="lazy" decoding="async"`, scale on hover.

### Opiniones
`<blockquote class="review-card">` with a `.stars` div carrying
`aria-label="5 de 5 estrellas"` (the ★ glyphs themselves are decorative).

### Ubicación
```html
<div class="location-map">
  <iframe src="https://www.google.com/maps?q=<QUERY>&output=embed"
          title="..." loading="lazy"
          referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
  <a class="location-map-openlink" target="_blank" rel="noopener"
     href="https://www.google.com/maps/dir/?api=1&destination=<NAME>&destination_place_id=<PLACE_ID>">
    Abrir en Google Maps ↗
  </a>
</div>
```
The open-link is **always present**, never conditional — see
`gotchas.md` for why failure detection is impossible here.

### CTA final
Inverted band: `--ink` background, cream text. White logo variant, live
tagline, split-text title, one giant magnetic button. This is the only
dark section and it is the reason the cursor must be white.

### Footer
Four columns (brand / dirección / horario / contacto), then a bottom rule
with `<span data-year>`.

### Gallery modal
One instance, last thing before the scripts. Structure:
backdrop (`data-gallery-close`) → inner → close button → prev arrow →
stage (`track` + `chip`) → next arrow → caption → dots. Backdrop uses
`backdrop-filter: blur(16px)`. Dots are monochrome ink/cream — if a brief
asks for a gradient accent, say plainly that it breaks the monochrome
system before adding it.

## Responsive breakpoints

`720px` (container padding, grid to 2col), `900px` (nav burger, hero
stacks), `1280px` (container padding, 3col grids). Test at 390px for
horizontal overflow — `overflow-x: clip` on `body` hides symptoms but is
not a fix.
