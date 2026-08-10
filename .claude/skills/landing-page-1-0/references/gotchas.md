# Gotchas — bugs already paid for

Each of these cost real debugging time on the Nuovolaser build. Read this
before investigating any similar symptom; the answer is probably here.

## Cursor invisible on dark sections

**Symptom**: the custom cursor vanishes over the dark CTA band / footer.

**Cause**: `mix-blend-mode: difference` with a near-black base
(`--ink: #15130f`) differences to ~black against a black background.

**Fix**: the cursor's base color must be **pure white `#fff`** — white
differences to black on light backgrounds and stays white on dark ones.
This applies to the SVG `fill`/`stroke`, the halo and the label pill.

## Cursor label text invisible ("white on white")

**Symptom**: the contextual label pill shows, but its text is unreadable.

**Cause**: putting the pill's `background-color` and the text's `color` on
one element with a single `mix-blend-mode` — the blend applies to the
composited result, so the text never differences against its own pill.

**Fix**: two nested elements, each with its own `mix-blend-mode:
difference` — outer `.cursor-label` (white background), inner
`<span data-cursor-label>` (white text). Sequential compositing produces
legible contrast in both directions.

## Content invisible when JS fails

**Symptom**: blank page if a script errors or is blocked.

**Cause**: `[data-reveal] { opacity: 0 }` in CSS regardless of JS state.

**Fix**: a blocking inline script in `<head>` adds `.js` to `<html>`, and
every hidden-state rule is scoped `.js [data-reveal] { ... }`. No JS → no
`.js` class → content renders normally. Keep the script inline and
blocking; a deferred or external one is too late.

## Hero mask never reveals

**Symptom**: the hero photo stays clipped forever.

**Cause**: the element has `clip-path: inset(0 0 100% 0)` and is its own
`IntersectionObserver` target. A fully clipped element reports a zero-area
intersection rect, so the observer never fires — it is waiting on a
condition its own style prevents.

**Fix**: two layers, no IO involved.
1. JS reveals `[data-reveal-mask]` on `load` + a 3s hard timer.
2. CSS safety net: `animation: maskSafety .01s 2.5s forwards` with
   `@keyframes maskSafety { to { clip-path: inset(0); } }`.

Never observe a clipped element on itself. If you need scroll-triggered
masking further down the page, observe an unclipped **parent**.

## Google Maps embed renders blank

The free keyless endpoint is `https://www.google.com/maps?q=<QUERY>&output=embed`.

`q=place_id:ChIJ...` is the syntax of the **paid** Maps Embed API and is
unreliable on the keyless endpoint; a plain-text address query
(`q=Calle+la+Alameda+1,+28922+Alcorcón,+Madrid`) is the documented-reliable
form. Nuovolaser ships `place_id:` because the user explicitly asked for it.

**If a user reports a blank map, switch to the address-text query first.**

You cannot test this from a sandbox — google.com is blocked by the egress
proxy. Say so plainly rather than claiming it works.

## "Show a fallback if the map fails" does not work

An iframe's `load` event fires even when the underlying request is blocked
(verified with Playwright route-abort: `net::ERR_CONNECTION_RESET` still
fires `load`). Cross-origin means you cannot inspect the content either.
There is no honest JS failure detection without a paid API.

**Fix**: ship an always-visible "Abrir en Google Maps ↗" link over the map
container. It works whether or not the embed rendered.

## Playwright full-page screenshots look broken

**Symptom**: `fullPage: true` screenshots show duplicated fixed elements,
misplaced nav, or blank sections.

**Cause**: Playwright resizes the real viewport to the full document
height, which breaks `position: fixed` assumptions and fires all the
IntersectionObservers at once.

**Fix**: this is a capture artifact, not a site bug. Verify with
normal-viewport incremental-scroll screenshots before "fixing" anything.

## Large video as a `data:` URI fails to play

**Symptom**: `networkState: NETWORK_NO_SOURCE`, then
`DEMUXER_ERROR_NO_SUPPORTED_STREAMS`, with a byte-perfect payload.

**Cause**: sandbox Chromium is an open-source build without H.264 decode
for direct data-URI sources.

**Fix**: build a Blob URL at runtime — chunked `atob()` → `Uint8Array` →
`Blob` → `URL.createObjectURL` — and set that as `src`. Add a JPEG
poster-frame CSS background behind the `<video>` as a fallback.

## Artifact publish fails at >16MB

Self-contained single-file builds with uncompressed photos blow the 16MB
Artifact limit. Generate **separate** downscaled JPEG copies (max 1000px,
q78) for the artifact preview only, and keep the originals untouched in
the repo. Never overwrite originals to fit a preview.

## Images the user says not to touch

When a user says "no las toques / sin comprimir", copy them **byte for
byte**. Renaming for ordering is fine; re-encoding, resizing or converting
format is not. Verify with a file-size comparison after copying.

The `.webp`-only warnings from any image verifier are then expected — do
not "fix" them.

## Pasted images are not files

Images pasted directly into chat (as opposed to uploaded) are visible to
the model but have **no filesystem path**. Searching `/root/.claude/uploads`,
`/tmp` or by mtime will not find them. Ask the user to upload the file, or
solve the task without needing the raw bytes (e.g. set text as live HTML
instead of extracting it from a logo image).
