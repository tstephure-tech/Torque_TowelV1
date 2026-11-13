# Teardown: Vero

URL: https://www.verostudio.com | Captured: 2026-11-13 | Category: editorial / luxury craft studio (productized service)

Captured at 1440×900, 768×1024, 390×844. Page height 15,061 px at 1440 = **16.7 viewports**.
Measurements below are computed styles read from the live DOM, not estimates, unless marked *(est.)*.

---

## Distinctive because

Every screen makes one claim and then leaves the rest of the paper empty — the page is a gallery, not a landing page, and the only saturated colour on it comes out of the photographs.

Swap in default fonts and colors and the site dies, because there is almost nothing else: no accent color, no cards, no shadows, no borders, no icons, no gradients. Its identity is (a) a Didone display face set at 9.3× the body size, (b) a two-register line — uppercase roman + italic lowercase inside the same sentence, and (c) an achromatic UI that refuses to compete with the imagery.

---

## Measurements

| Item | Value | Relationship |
|---|---|---|
| Display / body size | 168 px / 18 px | **9.33×** |
| Statement / subhead | 120 px / 30 px | **4.00×** |
| Manifesto / display | 168 px / 120 px | 1.40× |
| Overlay caption (over media) | 67.7 px italic | 3.76× body |
| Lede / body | 21 px / 18 px | 1.17× — subheads are barely bigger than body |
| Label (kicker, CTA) / body | 16 px, 15 px / 18 px | **0.89×, 0.83× — labels are *smaller* than body** |
| Footer fine print / body | 12 px / 18 px | 0.67× |
| Line height by size | display 1.00 · subhead 1.06 · kicker 1.10 · body 1.50 | leading only loosens for copy |
| Display tracking | `normal` (0) at 120–168 px; +0.36 px (+0.02em) at 18 px | tracking added as size *decreases* |
| Text column | 450 px fixed at every width ≥ 768; 350 px at 390 | 31% of viewport — **measure is fixed, not fluid** |
| Body line length | 450 px at 18 px | **≈ 62–68 characters** — wide in *ch*, narrow in px, because Louize Display is a narrow face |
| Page margin | 30 px desktop / 20 px mobile | — |
| Section heights (1440) | 900 · 2700 · 3840 · 290 · 2420 · 290 · 1283 · 1374 · 230 | acts are **1×, 3×, 4.3× viewport**; two 290 px quiet strips between them |
| Pinned sequence | 3840 px section with `position: sticky` children at `top: 0` | 3 stages scrubbed over **4.3 viewports** of scroll, dot rail as the only UI |
| Overscan on pinned media | 1640×1025 image in a 1440 viewport, `x: -200` | **114% width** — bleed for parallax |
| Gallery grid | 5 columns × 156 px, 150 px gutters, 195 px rows, 291 px row pitch | **gutter ≈ image width** (150 vs 156); image is 51% of its column pitch |
| Radii | `0` everywhere; one stray `2px` on a skip-link and one chip | square by system, not by accident |
| Borders / shadows | none found on any content element | separation is done with luminance |
| Fonts | Louize Display 400 (+italic) · Beausite Classic 400/500 | 2 families, 2 weights |
| Colors by element count | `#181615` 669 · `#979696` 73 · `#F8F8F8` 52 · `#F3F0ED` 21 | ink-dominated; one paper, one plate |
| Paper | `#F3F0ED` — oklch(0.955 0.006 60) *(conv.)* | warm bone, not white |
| Plate (chip/button fill) | `#F8F8F8` on `#F3F0ED` | **1.1:1 — ΔL 0.064. A whisper, not a box** |
| Ink / paper contrast | 15.9:1 | far beyond AA |
| Muted `#979696` / paper | **2.6:1** | used for rules and underlines only — never body text |
| Accent color | **none** | 0% of UI area |
| Area split *(est.)* | ~58% paper · ~37% photography · ~4% type · ~1% plate | — |

---

## Principles

### Type
Two faces, two jobs, and they never trade places: **Louize Display** (high-contrast Didone, roman + true italic) does every heading, every caption, and — unusually — the body copy; **Beausite Classic** (500) does only full-sentence subheads and the lede. Display never appears in sans, sans never appears large.

The scale is purpose-built, not modular, and it goes **below** body: 168 / 120 / 67.7 / 30 / 21 / 18 / 16 / 15 / 12. There is no fixed ratio between them (consecutive steps run 1.40, 1.77, 2.26, 1.43, 1.17, 1.13, 1.07, 1.25 — it jumps, then tightens, then jumps again). What *is* fixed is the rule that produces it: **copy is 18 px, and everything that isn't copy is either enormous or tiny.**

The signature move is a single line in two registers: uppercase roman for the statement, *italic lowercase for the emotional aside*, mixed mid-sentence — `DESERVES TO LAST *forever*.` / `so THAT YOU BECOME ART.` / `where INNOVATION meets CRAFTSMANSHIP`. Neither register can carry the line alone; the alternation is the voice. At 168 px the lines are allowed to run past both page edges.

At 390 px the 120 px statement holds at 46 px (still ~2.5× body), but the 168 px manifesto collapses to **19 px** — they chose legibility over scale rather than shrinking the giant line to fit.

### Color
Three values do 99% of the work: ink `#181615`, bone `#F3F0ED`, and the plate `#F8F8F8` that sits 1.1:1 above the paper. That last number is the point — buttons are separated by a **2–3% luminance step**, not by a border, shadow, or glass. The chip reads as a sheet lying on the page.

There is no accent color anywhere. All saturation is photographic and deliberately quarantined: warm terracotta and grey studio sweeps live inside the image frames, and the UI around them is strictly achromatic. Because the photography is the only color, it becomes the brand.

Muted `#979696` at 2.6:1 is never text — it is the hairline under the email field and the copyright line's quiet partner.

### Space and grid
The measure is a **fixed 450 px column centered in any viewport ≥ 768**, not a percentage and not a max-width. Type does not stretch; the emptiness around it does. On a 1440 screen that leaves 495 px of paper on each side of the copy.

Vertical rhythm is measured in **whole viewports**: a 900 px hero, a 2700 px act, a 3840 px pinned act, then 243 px and 290 px quiet strips used as breaths between acts. Sections never share a layout with their neighbour, and the page deliberately spends a full viewport on almost nothing.

The gallery inverts normal scale logic: 156 px images on a 306 px pitch with 150 px gutters. Objects are small and far apart, like a specimen board, and the row overflows the right edge so it reads as a drawer you could slide.

### Composition
The hero is a **full-bleed silent looping video with a centred wordmark and a six-word subtitle, and nothing else** — no nav bar, no scroll chevron, no second button. The header floats above it as two small plates pinned 30 px from the top corners, and the wordmark only appears in the header *after* you leave the hero.

Then: a blank viewport. Then one button. The page alternates **full-bleed media → loud statement → small centered copy block → full-bleed media**, and the only asymmetry is that copy blocks sit on the centre axis while images bleed edge-to-edge.

The one memorable move is the manifesto: a 168 px sentence with an *object placed inline where a word would go*, sat vertically between phrases, bleeding off both edges.

### Motion
Everything is scroll-driven and slow. Reveals are **line-level masks** (each display line rises out of its own clip), not fade-ups on whole blocks. The 3-stage process is a **pinned scrub**: the section is 3 viewports tall, the media sticks at `top: 0`, and the three images cross-fade as you scroll — with a 3-dot vertical indicator on the left edge as the only UI.

Hover is a **text roll**: every button contains a duplicate of its label and translates the stack on `transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)`. Color transitions are 300 ms `cubic-bezier(0.25, 0.1, 0.25, 1)`. Nothing bounces, nothing scales.

### Imagery
Original studio photography, one light, one seamless sweep, graded into **two moods that alternate**: warm terracotta (the dress, the person) and neutral grey (the sculpture, the object). Same crop logic throughout — subject centred, lots of air above, camera at chest height. Images are uncaptioned except for a 67.7 px italic line set bottom-left *inside* the frame.

Icons are effectively absent: a hairline menu glyph, a bag glyph, and `↗` on outbound links. No illustration, no 3D renders, no icon set.

### Voice
Declarative, first person, no imperatives. Headlines state consequences rather than ask for action: a claim about permanence, then a fragment about becoming art. CTA labels are **verb + object, lowercase italic + uppercase noun** — `*Start your* COMMISSION` — never "Get started". Specificity carries the proof: 15 inches, 5–10 pounds, ceramic-based resin. Two sentences of founder quote do the trust work instead of logos.

### Mobile
Not a stack of the desktop. The 390 px view keeps: the full-bleed portrait hero, 20 px margins, the 46 px statement type, 18 px body at 350 px measure, and the pinned scrub. It drops: the 168 px manifesto (to 19 px), the 5-column gallery (to 2–3 columns, still small and widely spaced), and the side-dot rail. The "empty act" shrinks from a full viewport to ~150 px. Composition survives because the *column*, not the layout, was the unit.

---

## Transferable principles

1. **Let photography own all the color.** Keep the UI strictly achromatic so the work itself is the only saturated thing on the page. This buys enormous visual richness for zero brand risk.
2. **Set one line in two registers.** Uppercase roman for the claim, italic lowercase for the aside, inside the same sentence. It reads as a human editor, not a template — and it survives typeface changes.
3. **Make copy 18 px and let everything else be enormous or tiny.** Labels below body size (0.67–0.89×), display at 4–9×. The absence of mid-size text is what makes the scale feel designed.
4. **Fix the measure, float the space.** A 450–470 px column inside a full-bleed frame means the layout composes itself at every width; the whitespace absorbs the viewport instead of the line length.
5. **Separate surfaces with luminance, not decoration.** A 2–3% step between paper and plate, zero radius, zero shadow, hairline rules only where a field needs an edge.
6. **Budget the page in viewports, and spend one on nothing.** Acts of 1×, 3×, 4.3× followed by a deliberate empty screen make each claim feel expensive.
7. **Pin one sequence and let scroll scrub it.** Exactly one scroll-linked moment, with a dot indicator, beats eight fade-ups.

---

## Do not borrow

- **Louize Display + Beausite Classic.** The pairing *is* the brand. Any high-contrast Didone display + neutral grotesque body reads as "the Vero look".
- **Bone `#F3F0ED` + ink `#181615` + terracotta photography.** That trio is their entire identity. A warm-bone page with orange-gold imagery is a copy, not a reference.
- **The centred wordmark over a full-bleed hero.** Their signature, and the most cloned part of the site.
- **Their copy, structure of sentences, founder quote, and the "worn once / become art" cadence.**
- **The inline mirror-disc manifesto**, the 5-column specimen gallery, and the `VERO` footer wordmark as executed — the *principles* are reusable, these exact compositions are theirs.
- **Their assets**: photography, logo, the `↗` treatment as a motif, the 3-dot rail styling.

---

## Screenshots

`desktop.png` · `tablet.png` · `mobile.png` · `hero.png`
Scroll frames: `frames/frames_{desktop,tablet,mobile}_NN.png` (viewport-height steps, in scroll order — use these instead of the full-page capture, which mis-stamps the fixed header and pinned sections).

> Full-page capture caveat: the site uses `position: fixed` header + hero and a sticky pinned section, so `desktop.png` repeats the header and blanks the pinned act. The frame sequence is the accurate record.
