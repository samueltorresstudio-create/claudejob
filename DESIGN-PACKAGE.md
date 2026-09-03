# Design Package — Nuovolaser, "El otro lado de la puerta"

Tier 1, single continuous shot. Written before the build; the build consumes it.
All viewer-facing copy here ships verbatim.

## 1. Brand premise

One word from the shop's own world: **umbral** (threshold). Nuovolaser sits on a
street in Alcorcón behind a lit glass front, and the whole experience is what
happens once you cross that door: the street stops, someone takes care of you,
you leave looking like yourself on a good day. The site teaches that one idea.
The hero literally walks the visitor through the door. Every section below is
what waits on the other side of it, and the closing interaction makes the
visitor push the door open themselves.

## 2. Palette (sampled from the footage)

Sampled from the shipping frames with a median-cut quantiser. The shop's own
material world: cream walls under lamp light, black lacquer joinery, honey
wood floor, amber bulbs, and one cool note through the door glass.

```css
:root{
  --canvas:#f4ede2;        /* the shop's cream wall under warm light */
  --canvas-2:#e9dccb;      /* alternating band */
  --panel:#fffaf3;
  --ink:#17120d;           /* the lacquer of the reception desk, warm-tinted */
  --ink-soft:#33291f;
  --ink-mute:#7a6a56;
  --accent:#b5722c;        /* the amber bulbs, as copper */
  --accent-hover:#96591d;
  --accent-muted:rgba(181,114,44,.26);
  --cool:#6d8a90;          /* the teal-grey coming through the door glass */
  --line:rgba(23,18,13,.13);
}
```

**Deviation, said out loud:** the skill bans near-black + warm amber as a
default reach. This is the carve-out, earned: those are the shop's literal
materials, sampled from its own footage, and the page stays cream-dominant
(the wall colour) rather than going dark. It also keeps v1's identity, which
the client asked to preserve.

## 3. Type trio

- **Display:** Cormorant Garamond 400, 500, italic 400. Carried over from v1;
  it is the brand's established face and has real character.
- **Body:** Inter 400, 500.
- **Mono (small labels, HUD, readouts):** IBM Plex Mono 400.

## 4. Band map

Hero height 560vh, so the scroll range is 460vh and each beat gets ~115vh,
about 7 normal flicks. Video is 6.6s; time = progress × 6.6.

| Band | Range | Footage moment | Copy (verbatim) | Entrance | Text zone |
|---|---|---|---|---|---|
| 1 | 0.00–0.25 | The lit facade, door dead centre, posters flanking | eyebrow "Alcorcón · Madrid" / **"Pasa dentro."** / "Empuja la puerta y mira." | approach-from-depth (echoes the forward push) | left column |
| 2 | 0.27–0.52 | Passing through the doorframe, the frame edges sweep past | **"La calle se queda fuera."** | halves parting (echoes the door opening) | left column |
| 3 | 0.54–0.76 | Inside, the room opens, warm light resolves | **"Dentro solo estás tú."** / "Y el rato que hayas reservado." | blur-to-sharp (echoes focus arriving) | lower band, over the floor |
| 4 | 0.80–1.00 | Settled at reception, wall sign readable, roses | **"Ya estás dentro."** / "Depilación láser, pestañas, manicura, pedicura, masajes y cejas." / CTA "Reservar por WhatsApp" | word-by-word rise into a staged settle | lower left, over the floor |

Ranges are starting points, validated by the flick test in Phase 9.

**The scrim plan (revised after the client saw it).** The first build read the
window lettering as an AI artefact and buried both flanks under heavy scrims to
hide it. The client corrected that: the lettering is the shop's own, the
footage's highlights are the point, and it should read as shot. So the flank
scrims are gone entirely.

What replaced them is composition rather than darkening: every beat now sits
low in frame, in the dark ground the footage already provides. The polished
pavement outside, the marble base at the threshold, the wood floor once inside.
White type on the shot's own black needs almost nothing added. The remaining
scrims are light bottom washes (0.50 / 0.52 / 0.44 / 0.70 peak), and the text
shadow carries most of the work.

The nav bar was the one place that still needed its own ground, because the
shop's illuminated sign sits directly behind it at scroll zero. It carries a
gradient the height of the bar only, rather than dimming a twelfth of the
footage to make room for it. Measured worst-pixel contrast there: 7.27.

## 5. Static-hero copy (phones, reduced motion)

Over the ending frame, which is the warmest and most inviting.

- **"Pasa dentro."**
- "Centro de estética y láser avanzado en Alcorcón, Madrid."
- CTA "Reservar por WhatsApp"

## 6. Below-fold outline

Every section funnels to one anchor: the WhatsApp booking link.
All of v1's content is preserved; the wording is tightened and the premise runs through it.

1. **Tratamientos** — the six services. Two of them carry real photo galleries.
   Kicker "Lo que hacemos". Title "Cada sesión, pensada **a medida.**"
2. **Por qué elegirnos** — the five reasons, unchanged in substance.
   Title "El detalle marca **la diferencia.**"
3. **El espacio** — the interior gallery. Title "Un lugar pensado **para ti.**"
4. **Opiniones** — the proof wall. Title "Lo que dicen **quienes nos visitan.**"
5. **Cómo llegar** — map, address, hours. Title "Te esperamos **en Alcorcón.**"
6. **Reservar** — the signature interaction and the single call to action.
   Title "Tu próxima sesión **empieza aquí.**"
7. **Footer** — address, hours, phone, WhatsApp. No fictional-brand disclosure
   needed: this is a real business and the imagery is its own.

**Form handling:** no form. The business takes bookings on WhatsApp and every
CTA on the page links straight to `wa.me` with a prefilled message. That is
the honest answer for a static site with no backend, and it is what the
business already uses.

## 6b. Interaction map

| Slot | What it is | Where |
|---|---|---|
| Signature | **"Empuja la puerta"** — press and hold; two lacquer panels part, amber light widens behind them, the booking details light up in sequence. Release early and it eases back. Enacts the premise literally. | Reservar |
| Supporting 1 | The "Explorar" photo galleries on two service cards | Tratamientos |
| Supporting 2 | Proof wall: two lanes drifting opposite ways, pausing on hover and focus | Opiniones |
| Cursor states | `link` on buttons and links, `text` over long copy, `hidden` over the video stage, `explore` on gallery cards | page-wide |
| Reactive | magnetic primary CTA; tilt on service cards; spotlight on the gallery grid; underline-draw on nav links | 4 elements |
| Scroll-linked | Tratamientos (headline drift), El espacio (image scale), Cómo llegar (threshold line draws) | 3 sections |
| Sticky chapter | none — the hero is the pinned chapter, and a second would read as a gimmick | — |
| Environment | fixed warm grain plus one very slow amber glow drift, 90s cycle | page-wide |
| Living element | one per section at whisper level: the scroll cue, the card sheen, the lane drift, the map pulse | listed |

Budget audit: one attention-grabbing effect per viewport. The loud spends are
the hero settle, the service card tilt, and the signature hold.

## 7. Vector layer plan

**The signature element: the threshold line.** A hairline that opens from the
centre outward, like the door. Drawn by hand as SVG, revealed with
`stroke-dashoffset` off each section's own `--p`. It appears as every section
divider, under the settle, and as the frame around the signature interaction.
Remove it and the page loses its through-line, which is the test the skill sets.

Plus: the five hand-drawn line-art icons carried from v1, and whisper-level
warm motes in the hero only. All of it honors reduced motion with final states
shown and drives stopped.

## 8. Engineering list

The full standard, named so the build cannot half-remember it: streamed Blob
fetch with the honest loading ring (4.6MB video), dt-normalised lerp resting
when converged, gated seeks with the deadlock escape, delta-gated DOM writes,
band pacing validated by the flick test, the four-layer legibility system,
the five static-hero gates kept live with change listeners, complete without
the video, and the quality floor. One shared pointer loop for every reactive
effect. Reduced motion honored live in both directions.

**Footage on record:** supplied by the client, 1280×720, 24fps, 8.0s, h264.
Trimmed to 6.6s at the last steady frame (the motion curve re-accelerated over
the final 8 frames), normalised to 30fps, encoded crf 20 with `-g 8`. No
watermark, so no crop applied. Ships at 4.6MB.

## 9. Copy gate

Every viewer-facing line above ships verbatim. The built page must pass the
Phase 9 grep gate (zero em dashes, zero stock words) plus the body-copy sweep
for AI tells before anyone sees it.


---

## Validated (Phase 9, headless Chromium, 1440x900 and 375x812)

| Check | Result |
|---|---|
| Worst-frame legibility, band 1 to 4 | 10.6 / 7.0 / 4.3 / 4.1 (floor is 3.5), with the footage ungraded |
| Nav worst-pixel contrast over the lit sign | 7.27 (floor is 4.5) |
| Flick test, 120px steps | every beat readable for 6 to 12 flicks |
| Flick test, 360px steps | no beat skippable, all four peak at full opacity |
| Scrub tracking | currentTime follows scroll exactly, 0 to 6.6s |
| Frame pacing, whole page | median 16.7ms, p95 16.8ms, zero tasks over 50ms |
| Phone (375px) | static hero, zero video requests, no sideways scroll |
| Reduced motion | static hero, zero video requests, wall static, door open |
| Reduced motion flipped live | pins in, re-arms out |
| Video missing | poster painted, captions live, page complete |
| Keyboard | full tab order, gallery focus trapped, Escape closes |
| Signature hold | builds, eases back on early release, completes and stays |
| Copy gate | zero em dashes, zero stock words, zero AI tells |
| Page weight excluding video | 622 KB, loads in 146ms locally |
| Hero video | 4.6 MB h264, 3.4 MB VP9, streamed behind the ring |

Not verifiable from this sandbox, to check on the live site: the Google Maps
embed (google.com is blocked by the egress proxy here) and the Google Fonts
stylesheet (blocked for the browser, though it resolves over curl).
