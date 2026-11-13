# DESIGN.md: Torque & Towel

> Source of truth for every UI decision on this project.
> **Agents:** read this file fully before any design or UI work. Never invent values that belong here. If something is missing, add it here first or ask.
> **Derived from:** [references/teardowns/verostudio.md](./references/teardowns/verostudio.md) — measured principles, not copied surfaces. Read the teardown before changing anything structural.

---

## 1. Brief

- **Audience:** Owners of cars they've already spent real money on — performance, luxury, EV, weekend cars — and they want their vehicle looking its very best. One stop shop for pampering your vehicle including detailing, scratch removal, wrapping, window tinting, etc.
- **Positioning (one sentence):** We bring the bay to the car, and we hand back a record of everything we did to it.
- **Primary action:** Book a service slot — one action, repeated three times, never competing with a second offer.
- **Tone, as pairs:** precise, not clinical / candid, not salesy / mechanical, not macho / warm, not cute.
- **Signature idea:** **The page is a service record.** Acts are numbered, measurements are real and set in mono, the process is one pinned three-stage sequence on the same car, and the only saturated colour anywhere is the paint.
- **Never:** the detailer template — hero car photo, three icon cards, before/after slider, row of five-star quotes, chrome-gradient logo.

---

## 2. Reference log

| Reference (URL) | Category | Borrow | Deliberately do differently |
|---|---|---|---|
| [verostudio.com](https://www.verostudio.com) | Editorial / luxury craft studio | Achromatic UI with colour only in photography; two registers inside one line; labels *below* body size; fixed ~440px measure inside full-bleed frames; viewport-sized acts with one empty act; plate buttons separated by luminance not borders; one pinned scroll sequence with a dot rail; line-level mask reveals; specimen-grid gallery; giant baseline-cropped footer wordmark | Their Didone display + neutral grotesque body (we invert the roles); warm bone + terracotta palette (we use the brand's Showroom White + papaya, and put the warm mood in a duotone rather than the page); centred wordmark over the hero and centred header wordmark (our lockup sits bottom-left in a flex row and the header mark is left-aligned); centred symmetry (we align to a numbered left margin rail); 16.7-viewport page (we run 15.1 so the menu and booking arrive sooner) |

Only one reference was used, at the owner's request. **This is a known risk:** a single source converges. Before this system is reused on a second project, teardown a reference from a different category and re-balance.

The brand kit (`Torque_and_Towel_Brand_Kit_Complete`, Option #4 mark / Option #8 palette) overrides this file's first draft. Where the teardown proposed a cool chalk page and a cold blue accent, the shipped build uses **Showroom White, Matte Graphite and Papaya Track Orange** — the reference's *structure* survives, its colour does not. Contrast values below are measured from the shipped tokens.

### Borrow matrix (principle → our implementation)

| Measured in the reference | Value there | Our value | Why |
|---|---|---|---|
| Display ÷ body | 9.33× | 7.8× (132 ÷ 17) | Same shock, harder voice — grotesque caps instead of a light Didone |
| Label ÷ body | 0.83–0.89× | 0.65–0.76× | Metadata should read as stamped, not written |
| Text column | 450px fixed | 440px fixed (350 at 390) | Fixed measure, floating space |
| Page margin | 30px | 32px / 20px | — |
| Section rhythm | 1×, 3×, 4.3× viewport + 290px strips | 1×, 2.3×, 3× + 200px strip | Acts shorter; one quiet act kept |
| Pinned sequence | 3 stages over 4.3 viewports | 3 stages over 3.3 viewports | Same mechanic, different content |
| Plate vs paper | 1.1:1 | 1.08:1 | Separation by luminance only |
| Radii | 0 | 0 | No soft corners anywhere |
| Accent | none | papaya `#FF5A1F`, graphics and plate fills only | The brand's own accent; keeps the achromatic discipline |

Full measurements, per-width type scale, and the "do not borrow" list live in the teardown.

---

## 3. Tokens

`tokens.css` must mirror this block exactly. No raw hex, no px font sizes, no ad-hoc radii anywhere else in the codebase.

### Typography
- **Display:** **Cabinet Grotesk** 700 (fallback Helvetica Neue). Uppercase, tight tracking. Used for: h1, h2, act headlines, footer wordmark. Never used for sentences.
- **Text:** **Newsreader** 400 + 400 italic (fallback Georgia). Used for: body, lede, captions, the italic half of every mixed-register line.
- **Mono:** **JetBrains Mono** 400. Used for: act numbers, spec tables, timestamps, form labels, legal. Never for sentences.
- **Roles do not cross.** Display never sets a sentence; mono never sets prose; serif never sets a 76px headline.
- **Scale:** purpose-built, not modular. Base 17px.
  `11 · 13 · 17 · 21 · 28 · 46 · 76 · 132` — steps run 1.18, 1.31, 1.24, 1.33, 1.64, 1.65, 1.74. Display is **7.8× body**.
- **Rules:** tracking −0.02em at 76px+, −0.01em at 46–76px, 0 at 28px, +0.01em at 17px, +0.12em on mono labels. Body measure **54ch / 440px** at 17px Newsreader — hold the *pixel* width, not the character count; the reference hit 62–68 characters only because its face is narrow. Lede **34ch**. Display lines may bleed past the page margin — that is intended.
- **Leading:** 1.0 at 46px and up; 1.06 at 28px; 1.5 for body only. Leading loosens only for copy.

### Color (brand tokens)
Brand kit tokens are authoritative. Hex is the source; OKLCH equivalents are noted for future work.

- **Paper — Showroom White:** `#FFFFFF`.
- **Ink — Matte Graphite:** `#171717` — **17.9:1** on paper.
- **Ink 2 — Carbon Slate:** `#242629` — the dark act surface (`--ink` is used as a background for the spec plate).
- **Surface (plates, option rows):** `#F6F6F7` — **1.08:1** above paper. A whisper, never a border.
- **Muted:** `#6E7175` — **4.90:1** on paper, 4.54:1 on surface. Safe for secondary text *and* rules.
- **Accent — Papaya Track Orange:** `#FF5A1F` — **3.12:1** on paper. Graphics, rules, dots, plate fills and type ≥24px only.
- **Accent, text-safe — `#B83E08`:** 5.63:1. Use whenever the accent has to carry small text (eyebrows, flags, links).
- **Titanium Silver:** `#CBD5E1` — 1.48:1. Hairlines and disabled states only, never text.
- **On papaya** use `--ink` (`#171717`), never white: ink on papaya is **5.75:1**, white on papaya is 3.1:1 and fails.
- **Accent budget:** the active stage dot, the focus ring, one spec-table tick, the plate fill of the primary action, and the hover underline. **Never a decorative gradient.**
- **Color comes from the work.** All saturation in photography; the UI stays achromatic except for the papaya signal. If a page needs more colour, the photography is wrong.
- **Dark mode:** no. The paper *is* the brand; the one dark act is a deliberate composition choice, not a theme.

### Space and layout
- **Base unit:** 4px. Scale: `4, 8, 12, 16, 24, 40, 64, 104, 168`.
- **Page margin:** 32px desktop, 20px below 640px.
- **Container:** no max-width container. Media is full-bleed; **text is a fixed 440px column** (capped at `100vw − 2 × gutter`, so 350px on a 390 screen) placed on the grid, never a percentage.
- **Grid:** 12 columns for media placement only (film 8 col / copy 4 col; triptych 4/4/4; gallery 5 equal with 2-col gaps). Copy never spans more than 4 columns.
- **Section padding (vertical):** acts are measured in viewports, not padding — see §4. The only interpolated padding is the quiet strip: `200px` desktop / `144px` mobile.

### Shape and depth
- **Radius:** `0` everywhere. No exceptions, including inputs, plates, and image frames.
- **Borders:** one hairline only — `1px solid rgba(23,23,23,0.16)` — under form inputs, between price rows, between spec-table rows. On the graphite act the hairline is `rgba(255,255,255,0.12)`.
- **Shadows:** none. No `box-shadow`, no backdrop-filter, no glass. Separation is luminance.

### Motion
- **Easings:** `--ease: cubic-bezier(0.22, 0.61, 0.36, 1)` for reveals; `--ease-roll: cubic-bezier(0.25, 1, 0.5, 1)` for the button text roll.
- **Durations:** 180ms UI, 800ms line reveal, scroll-scrubbed pin runs at scroll speed.
- **Personality:** mechanical and exact — a panel gap closing, not a bounce. Nothing scales. Nothing springs.
- **Allowed:** one scroll-scrubbed pinned sequence per page; line-mask reveals on display type (once, in view); text-roll on button hover; 180ms color fades on links. **Everything else is static.**
- **`prefers-reduced-motion`:** pinning becomes a static 3-image stack, masks become instant, all transitions 0ms.

### CSS starting point

```css
:root {
  /* type */
  --font-display: "Cabinet Grotesk", "Helvetica Neue", Arial, sans-serif;
  --font-text: "Newsreader", Georgia, "Times New Roman", serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", monospace;

  --text-label: 0.6875rem;                        /* 11 */
  --text-data: 0.8125rem;                         /* 13 */
  --text-body: 1.0625rem;                         /* 17 — constant at every width */
  --text-kicker: clamp(1.0625rem, 1.46vw, 1.3125rem);  /* 17 → 21 */
  --text-lede: clamp(1.375rem, 1.94vw, 1.75rem);       /* 22 → 28 */
  --text-act: clamp(2rem, 3.19vw, 2.875rem);           /* 32 → 46 */
  --text-h2: clamp(2.5rem, 5.28vw, 4.75rem);           /* 40 → 76 */
  --text-h1: clamp(2.75rem, 9.17vw, 8.25rem);          /* 44 → 132 */

  /* colour — brand kit tokens */
  --paper: #FFFFFF;
  --surface: #F6F6F7;
  --ink: #171717;
  --ink-2: #242629;
  --muted: #6E7175;
  --titanium: #CBD5E1;
  --accent: #FF5A1F;
  --accent-deep: #B83E08;
  --hairline: rgba(23, 23, 23, 0.16);
  --hairline-soft: rgba(23, 23, 23, 0.09);
  --on-dark: #FFFFFF;
  --on-dark-muted: rgba(255, 255, 255, 0.62);

  /* space */
  --space-1: 0.25rem; --space-2: 0.5rem;  --space-3: 0.75rem;
  --space-4: 1rem;    --space-5: 1.5rem;  --space-6: 2.5rem;
  --space-7: 4rem;    --space-8: 6.5rem;  --space-9: 10.5rem;

  /* layout */
  --gutter: 32px;
  --measure: min(440px, calc(100vw - 2 * var(--gutter)));  /* 440 desktop, 350 at 390 */
  --measure-wide: min(760px, calc(100vw - 2 * var(--gutter)));
  --measure-lede: 34ch;
  --strip: 200px;

  /* shape */
  --radius: 0px;
  --rule: 1px solid var(--hairline);

  /* motion */
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  --ease-roll: cubic-bezier(0.25, 1, 0.5, 1);
  --dur-ui: 180ms;
  --dur-reveal: 800ms;
}

@media (max-width: 640px) {
  :root { --gutter: 20px; --strip: 144px; }
}
```

---

## 4. Composition rules

- **Page rhythm (measured at 1440×900: 13,601px ≈ 15.1 viewports):**

  | # | Act | Built height | Layout |
  |---|---|---|---|
  | 1 | Hero — film | 1.0× | Full-bleed reel; text lockup bottom-left, film controls bottom-right |
  | 2 | **Quiet act** | 0.9× | Paper only. Mono label + one sentence. `00 —` in the margin. |
  | 3 | 01 — Condition | 2.3× | Full-bleed media fading into paper, 76px statement, copy, 3-up triptych |
  | 4 | 02 — Process | 3.0× | Pinned: three stages scrubbed, dot rail left, caption bottom-left per stage |
  | 5 | strip | 0.22× | Empty |
  | 6 | 03 — Coat | 0.9× | Asymmetric 7/5: duotone plate left, copy + spec list right |
  | 7 | Spec plate | 1.05× | Graphite act, mono data table — the proof |
  | 8 | Manifesto | 0.55× | 132px two-line statement, object inline, centred |
  | 9 | Quote | 0.3× | One named customer, car model and service |
  | 10 | The menu | 2.35× | One-off price groups left, wrap/tint/membership + market scan right |
  | 11 | Gallery | 1.0× | 5-column specimen grid, small images, wide gaps, drawer bleed right |
  | 12 | Close | 0.45× | Centred lede + one accent plate |
  | 13 | Footer | 0.55× | Giant wordmark cropped at the baseline, links small and left |

  The reference spends 16.7 viewports; this page spends 15.1 because the menu and booking have to be reachable. Do not grow it further without removing an act.

- **Consecutive sections must not share a layout.** Loud → quiet → asymmetric → data → loud.
- **Hero:** the reel is **full-bleed**, muted, looping, `playsinline`, with a poster frame and a two-axis scrim (bottom 82% → transparent, plus a left wash) so white type holds AA. The lockup sits bottom-left in a flex row: eyebrow, 132px two-line display, one sentence of subcopy, one accent plate. Film controls (a hairline cue and a pause toggle) sit bottom-right, in the same row, so they can never collide with the copy — the row stacks below 900px.
  **Never centre a wordmark over the media** — that is the reference's signature. The mark enters the header only after the hero, left-aligned beside `MENU`.
- **Asymmetry:** at least one off-grid moment per page — the manifesto bleeds past both edges; the film is deliberately not full-bleed; the footnote sits in the outer margin.
- **The numbered rail:** every act carries `01 —` … `03 —` in mono at the left margin, in the gutter, never inside the text column. This is the signature; keep it to three numbers on the page.
- **Density:** narrative acts breathe (one idea, 40% of the act empty); the spec plate is tight, mono, rule-separated — deliberate contrast.
- **Proof:** a **spec table**, not logos. Real numbers in mono with units (microns of clear coat measured, hours in the bay, cure window, water spots removed). Named customers with car model and a single sentence — three of them, never five.
- **Navigation:** fixed header, transparent, no bar. Mono plate left (`MENU`), mono plate right (`*Book* A SLOT`). The wordmark appears in the header only after the hero, **left-aligned beside `MENU`** — the reference centres it, and centring is the habit we are avoiding. No sticky CTA on mobile.
- **Primary action placement:** header plate, hero plate (same scroll position, counted as one placement), the menu act, and the close act. Footer repeats it as a text link. Same label every time: *Book* A SLOT.

### Booking page (`book.html`)
- **Layout:** 132px top padding, title left, four-step rail right. Below: a 7/5 grid — steps on the left, a sticky summary on the right, top-aligned at 104px.
- **Steps:** 01 Service → 02 Vehicle → 03 Time → 04 Details. Never more than four; the price is known before the customer reaches the calendar.
- **Summary honesty:** the aside carries the live total and the 20% deposit at every step. Below 1024px it becomes a sticky bar pinned under the header showing title + total; the detailed rows fold away.
- **Validation:** inline, on submit only, `--accent-deep` rule under the offending field, focus moved to the first error. Never a modal.
- **Confirmation:** replaces the grid — reference number in a hairline box, an eight-row record, add-to-calendar, and nothing else.

---

## 5. Imagery and iconography

- **Source:** the brand reel (`assets/tt-reel.mp4`, 1280×720, 8s, H.264). Stills are derived from it — fourteen frames sampled across the loop, the six most distinct kept by farthest-point sampling, then cropped. No stock, no renders, no AI car images.
- **Treatment:** two moods that alternate and never mix inside a row:
  1. **Paint** — the natural grade (cool, near-black, reflections intact), +7% contrast. Used for hero, condition, process, gallery.
  2. **Finish** — a papaya duotone built from the same frames (graphite → `#FF5A1F` → warm highlight). Used once, on the coat act, to give the page the warm/cool alternation the reference gets from its photography.
- **Derivation rules:** never upscale a still past 1.6× its source width; always crop from the 1280×720 master (16:9 for bands, 4:5 for triptych and gallery, 1:1 for the inline object). Re-cut from the master rather than resampling a derivative.
- **Before launch:** replace the derived stills with commissioned photography on the same two-mood brief. The layout does not change; only the source does.
- **Crop logic:** subject centred, generous air above, and **one ratio per act** (film 16:9, triptych 4:5, gallery 4:5, process 3:2) — never mixed inside a row.
- **Color quarantine:** grade to keep saturated color *inside* the frame. Never let a page background pick up a tint from the photo.
- **Icons:** none. A hairline menu glyph, an arrow for outbound links, and a 6px square for the stage dot. No icon set, no emoji, no mixed weights.
- **Data and diagrams:** the spec table is HTML; any measurement diagram is inline SVG using `--ink`, `--muted`, `--accent` only. Never a screenshot of a chart.

---

## 6. Voice and copy

- **Voice in one line:** a detailer who has done this ten thousand times, telling you exactly what happened to your car, without selling you anything twice.
- **Reading level / jargon:** plain, but never condescending. Own the vocabulary — clear coat, decon, two-bucket, IR cure — and define it once, inline, in eight words or fewer.
- **Headline pattern:** a specific claim with a number, a material, or a mechanism. Never an imperative verb + abstract benefit.
  - Good: `Nine hours in the bay. One car.`
  - Bad: `Experience the ultimate shine.`
- **Mixed register:** every display line pairs uppercase grotesque with a Newsreader italic aside — `NINE HOURS *in the bay.*` The italic is the human voice; the caps are the instrument. Never write a display line in one register only.
- **CTA labels:** verb + object, lowercase italic + uppercase noun — `*Book* A SLOT`, `*See* THE RECORD`. Never "Get started", "Learn more", "Submit".
- **Banned words:** unlock, supercharge, seamless, elevate, revolutionize, leverage, game-changing, cutting-edge, next-level, effortless, pristine, showroom shine, passion, obsessive, "in today's fast-paced world".
- **Proof over claims:** every claim gets a number, a name, or a mechanism. If a sentence has none of the three, cut it.
- **Pricing copy:** always state the class basis ("prices are for a coupe or sedan"), always show the deposit next to the total, and label market ranges with their year. Never a strikethrough "was" price, never a countdown, never "only 2 slots left".
- **Numbers we publish are numbers we produce:** microns measured, hours in the bay, panels audited. Do not invent customer counts or awards.
- **No exclamation marks. No emoji. No sentence longer than 28 words.**

---

## 7. Anti-slop: hard bans

Do not ship any of these unless §1 explicitly overrides them:

1. Purple-to-blue or pink-to-orange gradients, gradient text, or gradient orbs behind the hero.
2. Centred hero with headline, subhead, two buttons, and a floating UI screenshot.
3. A row of three equal feature cards with icon, title, and two lines of text.
4. Uniform rounded-xl corners and soft shadows on every container.
5. Glassmorphism / frosted panels as a default surface.
6. Inter, Roboto, Arial, or system-ui as the display face.
7. Emoji used as icons or bullets.
8. Stock photos, floating abstract 3D shapes, or generic "dashboard" mockups.
9. Fade-up-on-scroll applied to every element.
10. A final CTA band that repeats the hero in a colored box.
11. Placeholder-feeling copy: lorem ipsum, "Feature one", "Your company here".
12. **Before/after sliders, wipe reveals, or "drag to see the difference"** — the single most generic device in this category.
13. **Chrome, metallic, or high-gloss gradient type** on the brand name.
14. **A five-star row, a trust-badge strip, or a "As seen in" logo bar.** Proof is the spec table (§4).
15. **Countdown timers, "only 2 slots left", or any scarcity the booking system cannot prove.** The calendar already shows what is gone.
16. **A "Book now" modal that interrupts the page.** Booking is a page, not an overlay.

---

## 8. Component notes

- **Plate button:** `background: var(--surface)`, ink label, `padding: 13px 22px`, radius 0, no border, no shadow. Label is a two-register line: **italic Newsreader verb (17px)** + **mono uppercase noun (11px, +0.12em)** — *Book* A SLOT.
  Hover rolls the label stack up 100% onto an aria-hidden duplicate (`--ease-roll`, 180ms); the plate itself never moves, changes colour or grows. `--accent` variant fills papaya with ink text (5.75:1) — never white on papaya (3.1:1, fails).
- **Two-register line:** every display headline pairs uppercase Cabinet Grotesk with an italic Newsreader aside via `<em>`. The `<em>` resets `text-transform` and adds 4% optical size so the serif does not look small beside the grotesque caps.
- **Header:** fixed, 72px, transparent, no background and no blur. Left plate `MENU`; right plate `*Book* A SLOT` — the same label used in the close act and the footer, never a variant. Both plates sit 20px from the top and align to the page margin.
- **Links:** ink, no underline at rest, 1px `--accent` underline on hover offset 3px. Outbound links get a hairline `↗` at 0.8em.
- **Forms:** one field per row, no box. 1px rule under the input at 45% muted, label in 11px mono uppercase above, `--accent` rule on focus. No placeholder-as-label.
- **Section marker:** `01 —` in 11px mono at the left margin, `--muted`, `+0.12em`. The em dash is part of the label.
- **Spec table:** two columns (label / value), 13px mono, 1px rules between rows, values right-aligned, units in `--muted`. One row carries the accent tick.
- **Pinned sequence:** 300vh section (240vh below 640px); media `position: sticky; top: 0`; three frames cross-fade over 700ms as scroll progresses; the active stage is computed from `-top / (height − innerHeight)` into thirds. Each stage owns its caption, so the whole thing degrades to three captioned stills under `prefers-reduced-motion`.
- **Dot rail:** a 32×32 hit area with a 7px mark inside (never a 7px button). Active mark is `--accent` at 1.3×. Clicking a dot scrolls to the middle of that stage.
- **Price row:** name (serif, 22px) + amount (mono, right, with a small unit line) + meta (mono 11px, muted) over a hairline. Group headers are the only 1px ink rules on the page.
- **Membership row:** display name in caps + `/mo` mono price + one 15px sentence. Deliberately not a card and not a column of three.
- **Market scan:** mono label/value pairs with `--hairline-soft` rules and a three-line note. It is a footnote table, never a comparison widget.
- **Booking option row:** full-width radio/checkbox row — name, description, duration, price. Selected state = `--surface` fill + a 2px `--accent` left rule; the input itself is visually hidden but focusable, and focus paints the row.
- **Calendar:** Sunday-first 7-column grid, 44px minimum cells, disabled days in Titanium, selected day inverted to ink. Only days with a free slot are enabled.
- **Slots:** mono chips in a 104px-min auto-fill grid; taken slots disabled rather than hidden, so the customer can see the day is busy rather than broken.
- **Summary aside:** sticky at 104px, ink top rule, live total in 28px mono, deposit sentence underneath. Below 1024px it becomes a sticky bar with title + total only.
- **Gallery:** 5 equal columns, images 4:5 at **≈half the column pitch** (small), 104px gutters, `--space-9` between rows. Overflow the final column past the right margin so the row reads as a drawer.
- **Cards / panels:** none. No card component exists in this system. If a block needs a boundary, it gets a hairline rule or more space.
- **Footer:** nav in 15px Newsreader, left; newsletter input with a single hairline rule and an arrow; the wordmark at `--text-h1` scale, ink, flush to both margins and **cropped by the page bottom by ≈8% of its height**; legal row 11px mono, `--muted`.

---

## 9. Decision log

*Newest first. One line each. Update after every critique round or direction change.*

- 2026-11-13 — **Built.** Static site: `index.html`, `book.html`, `css/tokens.css` + `site.css` + `booking.css`, `js/catalog.js` + `site.js` + `booking.js`. Fonts self-hosted; no runtime dependency on a font CDN.
- 2026-11-13 — Brand kit supersedes the first-draft palette: Showroom White / Matte Graphite / Papaya `#FF5A1F`. The cold blue accent is removed; accent-as-text uses `#B83E08` (5.63:1) because papaya alone fails at 3.12:1.
- 2026-11-13 — Hero changed from the draft's inset film to **full-bleed reel with a bottom-left lockup**, because the owner asked for the film as a background. The reference's centred wordmark is still avoided.
- 2026-11-13 — Page budget grew from 13 to 15.1 viewports to fit the price menu and the quote. Additions are logged here rather than hidden.
- 2026-11-13 — Imagery derived from the brand reel (14 frames sampled, 6 kept, one papaya duotone) so the build ships with real motion stills; commissioned photography replaces it before launch without changing layout.
- 2026-11-13 — Booking engine scoped to four steps with live pricing and a 20% deposit; capacity 2 vans, Mon–Sat 08:00–18:00, 24h notice, 60-day horizon, multi-day jobs occupy every day they span.
- 2026-11-13 — Market ranges published on-page as a labelled 2025 US scan; no live sources could be fetched at build time, so the ranges are stated as a scan rather than cited one-by-one.
- 2026-11-13 — System derived from a measured teardown of verostudio.com; type roles inverted (grotesque display / serif body / mono metadata) so the reference's Didone pairing is not reproduced.
- 2026-11-13 — Single-reference synthesis accepted at owner's request; recorded as a convergence risk in §2.
