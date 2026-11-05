# DESIGN.md — UI/UX rules (all tools must follow)

## 1. Principles
- **Mobile-first.** Most users arrive from Instagram on a phone (often the in-app browser). Design at 375 px, then scale up.
- **One main action per screen.** Big, obvious primary button.
- **Coach, not exam.** Friendly, encouraging tone. Mistakes are learning moments.
- **Built on shadcn/ui.** Use shadcn primitives (Base UI) for every standard element; only build custom components by composing them.
- **Fast & light.** No other UI kits, no animation libraries, no images over 200 KB.
- **Never show raw errors.** Failures fall back silently to "Offline coach mode".

**Precedence:** this file beats any skill. The `frontend-design` skill is for polish (hierarchy, spacing, small interactions) *within* these rules — it must not change the colours, font, or layout below.

## 2. Layout
- App screens (`/interview`, `/quiz`): content column `max-w-md` (448 px), centred, `px-4` side padding.
- Landing (`/`): sections up to `max-w-5xl`, single column on mobile, 2–3 columns from `md:`.
- Sticky top bar (h-14): app name (left) · XP chip with level (right). **Navy bar** (`bg-primary`, white Cinzel name) with a 2 px **gilt** bottom edge (`border-gilt`, token `--gilt: #C9A24E` — lighter bronze that reads on navy); inner width `max-w-5xl`. *(user-approved 2026-11-06)*
- Footer: SDG badge, Instagram link, privacy note (small text).
- No horizontal scroll at any width. Vertical spacing: `space-y-6` (app), `py-16` (landing sections).

## 3. Design tokens — `app/globals.css` (shadcn/ui + Tailwind v4)
`npx shadcn@latest init` generates `globals.css` with CSS variables and an `@theme inline` block.
**Keep the generated structure.** Then:
1. Replace the values in `:root` with the ones below.
2. Delete the `.dark { ... }` block (light mode only).
3. Add the custom tokens and their `@theme inline` mappings shown below.

```css
:root {
  --radius: 0.75rem;

  --background: #FBFBF9;          /* page canvas: Athenian marble */
  --foreground: #0F172A;          /* main text: obsidian */
  --card: #FFFFFF;
  --card-foreground: #0F172A;
  --popover: #FFFFFF;
  --popover-foreground: #0F172A;
  --primary: #1B365D;             /* main buttons, links: Deep Aegean Navy */
  --primary-foreground: #FFFFFF;
  --secondary: #EFF3F8;           /* soft brand: selected states, chips, improved-answer box */
  --secondary-foreground: #1B365D;
  --muted: #F1F3F5;
  --muted-foreground: #475569;    /* secondary text: acropolis stone */
  --accent: #EFF3F8;
  --accent-foreground: #1B365D;
  --destructive: #B91C1C;
  --border: #E2E6EB;
  --input: #E2E6EB;
  --ring: #926018;                /* Corinthian bronze gold */

  /* custom (not in shadcn by default) */
  --success: #15803D;
  --success-soft: #DCFCE7;
  --danger-soft: #FEE2E2;
  --warn: #926018;
  --warn-soft: #FEF3C7;           /* offline coach mode */
}

@theme inline {
  /* keep everything shadcn generated here, and add: */
  --font-serif: var(--font-cinzel), "Times New Roman", Times, Georgia, serif;
  --font-sans: "Times New Roman", Times, Georgia, serif;
  --color-success: var(--success);
  --color-success-soft: var(--success-soft);
  --color-danger-soft: var(--danger-soft);
  --color-warn: var(--warn);
  --color-warn-soft: var(--warn-soft);
}
```
- Use token classes only: `bg-primary`, `text-muted-foreground`, `bg-secondary`, `border-border`, `bg-success-soft`, `text-warn`, etc. No raw hex values in components.
- **Light mode only** (dark mode is out of scope).

## 4. Typography
- Headings: **Cinzel** via `next/font/google` (variable `--font-cinzel`), weights 600/700 (Classical Greek-Roman aesthetic).
- Body & Inputs: **Times New Roman** (`"Times New Roman", Times, Georgia, serif`).
- Scale: H1 `font-serif text-3xl md:text-5xl font-bold tracking-tight` · H2 `font-serif text-xl font-semibold` · Body `text-base leading-relaxed` · Small `text-sm text-muted-foreground`.
- Max line length ~65 characters for paragraphs.

## 5. Shape & depth
- Radius comes from `--radius` (0.75rem). Use shadcn defaults; don't hard-code other radii except `rounded-full` for chips and the mic button.
- Cards: shadcn `Card`, whose base uses the **`slab`** utility (globals.css): `bg-card/90` + light `backdrop-blur-sm` + `border-primary/15` + `shadow-lg shadow-primary/10`, so cards lift off the veined marble. Boxes that sit directly on the page background use `slab` too. Don't override it with faint `bg-card/60`, `border-border` or `shadow-xs` (they blend into the marble). No gradients on cards. *(user-approved 2026-11-06)*

## 6. Components
### 6.1 shadcn primitives (`components/ui/` — add with `npx shadcn@latest add <name>`)
`button` · `card` · `badge` · `progress` · `textarea` · `input` · `label` · `alert` · `skeleton` · `separator` · toast (use whichever toast component the current shadcn registry provides — check via the shadcn MCP server or docs).
- **Button touch size:** edit `components/ui/button.tsx` so the `lg` size is at least `h-11` (44 px). Use `size="lg"` for all main actions; full width on mobile (`w-full sm:w-auto`).
- Variants used: `default` (primary), `secondary`, `outline`, `ghost`.

### 6.2 Custom components (`components/` — composed from the primitives above)
| Component | Built from | Rules |
|---|---|---|
| `XpChip` | Badge | Header: "⚡ 120 XP · Junior". Shows "Guest" if storage is blocked. |
| `QuestionCard` | Card + Badge | Question text + framework badge (STAR / SEAT / Checklist). Selected = `ring-2 ring-primary bg-secondary`. |
| `MicButton` | Button (`rounded-full`, 56 px) | States: idle (mic icon) · listening (red pulsing dot + "Listening… tap to stop" + timer) · unsupported (hidden; show text hint). |
| `AnswerBox` | Label + Textarea | Min 6 rows, label "Your answer", counter `x / 1500`, helper "Speak or type. Aim for 1–2 minutes." |
| `FeedbackPanel` | Card + Badge + Separator | Order: score (big number /10) → source badge → element checklist (✓/✗ icon + name + comment) → Strengths → Improvements → Improved answer (`bg-secondary` quote block + Copy button) → Communication tip. Wrap in `aria-live="polite"`. |
| `OfflineNotice` | Alert | `bg-warn-soft text-warn`: "Offline coach mode — AI is busy, here's a checklist review." |
| `LoadingFeedback` | Skeleton | Skeleton card + "Coach is reviewing your answer…". |
| `QuizOption` | Button (`outline`, full width, left-aligned, wraps text) | After answer: correct = `bg-success-soft border-success` + ✓; wrong pick = `bg-danger-soft border-destructive` + ✗; others dimmed. Lock after answering. |
| `QuizProgress` | Progress | Bar + text "3 / 10". |
| `WhyBox` | Alert (default) | "Why:" bold + explanation. |
| `ResultScreen` | Card + Badge + Button | Big score, XP earned, badge earned (icon + name), IG share line, 2 buttons. |
| `InAppBrowserBanner` | Alert | Small dismissible tip for voice in the Instagram browser. |

Icons: `lucide-react` only (shadcn's default), 20–24 px, always paired with text.

## 7. States
- **Loading feedback:** disable Submit, show `LoadingFeedback`. Never block for > 15 s (client timeout → offline).
- **Empty:** helpful prompt text, never blank areas.
- **Error:** never shown as error — becomes Offline coach mode.
- **Storage blocked:** app works; XP chip shows "Guest".
- **Badge unlocked:** toast (non-blocking), no modal.

## 8. Accessibility
- Colour contrast WCAG AA (text ≥ 4.5:1). Keep shadcn's built-in focus rings (`ring` token) — don't remove outlines.
- Every input has a `Label`. Buttons have text labels (icons decorative).
- Correct/incorrect never shown by colour alone (icon + word).
- Respect `prefers-reduced-motion` (disable pulse/transitions).
- Tap targets ≥ 44 × 44 px.

## 9. Copy rules
- Plain English, short sentences, second person ("you"). Friendly for Malaysian students; no confusing slang.
- Buttons are verbs: "Start practice", "Submit answer", "Next question", "Play again".
- Encouraging feedback language: "Nice — your Action is clear." / "Add a Result: what changed because of you?"
- First mention of STAR/SEAT shows a one-line meaning.

## 9b. Greek / Aegean motifs (`components/greek.tsx`) — user-approved 2026-11-06
- **One bold moment:** the landing hero is a temple front (pediment that draws in once on load → inscribed entablature with the app name → Greek-key frieze → two Ionic columns framing the CTAs → stepped base). Don't add more page-load animation elsewhere.
- **Greek key (`MeanderBand`)** = structure only: footer top border, short ornament under page/section titles. Colour `text-bronze/60–80`.
- **Laurel** only around scores ≥ 8 (quiz result, feedback score) — it means "excellent", don't use it as decoration.
- **Roman numerals** only for real sequences (quiz scenarios I–X).
- **Marble** = visible grey + bronze SVG-turbulence veins and a warm light from above on `body` (globals.css), "ethereal and grandiose" per the user. Cards sit on it as `slab`s (§5).
- **Landing sky (hero only):** slowly turning sun rays, drifting gold dust, mist at the temple base, and a CSS-3D temple (swings up on load; tilts toward the mouse with depth layers). No WebGL/3D library.
- All motifs are inline SVG / CSS masks using tokens (`text-primary`, `text-bronze`) — no image files. Every sub-page starts with a `BackButton` (44 px).

## 10. Don't
- No modals or dialogs in the main flow, no carousels, no auto-playing media, no pop-ups.
- No UI kits other than shadcn/ui (no MUI, Chakra, HeroUI, Magic UI, Aceternity, etc.).
- No shadcn themes/presets that override the tokens in §3.
- No purple/blue gradients, glassmorphism, or decorative blobs ("generic AI look").
- No layout that needs a desktop to use.
