# Reference implementation

Verbatim copies of the shipped Nuovolaser landing page — the source of
truth for this skill. Copy these into a new project root and adapt.

```
index.html              full page markup
styles.css              the whole design system, 16 numbered sections
main.js                 one IIFE, all init modules
lib/manifest.js         window.__BRAND__ — brand/content data
lib/gallery-manifest.js window.__GALLERY__ — per-service photo arrays
```

Not included (fetch or generate per project):

- `lib/gsap.min.js`, `lib/ScrollTrigger.min.js` — vendor with
  `npm pack gsap@3.12.5` (CDNs are often blocked in sandboxes)
- `assets/img/*` — the client's own photos and logo
- `images/servicios/<slug>/*` — gallery photos, kept untouched
- `favicon.ico`, `assets/img/favicon.png`

Everything Nuovolaser-specific to replace: business name, tagline, phone
(`34611474447`), address, Google Place ID
(`ChIJp1rP1HKPQQ0RCjdK0dcFQVM`), services, reviews, image paths, `<title>`,
meta description and og tags.

Note: the tagline reads "Láser Vanzado · Especialistas" — the missing "A"
is intentional, matching the client's own logo at their explicit request.
Do not carry it into a new project.
