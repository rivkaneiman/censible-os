# Censible OS — Design Guide

A single source of truth for how every tool in Censible OS should look and feel. The goal is that a marketer, a facility admin, or an internal team member can move between the rounding log, the admissions tracker, the attestation tool — anything — and feel like it's one platform.

**How to use this guide:** Paste it (or a link to it) at the start of any new chat where you're building a Censible OS tool. The best place is the project's knowledge — every chat in the project will then have access to it automatically.

---

## 1. Aesthetic in one sentence

Refined and editorial, with glass on top — calm paper-feeling layouts, but every interactive surface (cards, buttons, nav, modals) is treated as translucent glass floating above the page. Not corporate-bland, not flashy. A serious operations tool with tactile depth.

If you're choosing between two design directions and one feels like enterprise SaaS and one feels like a thoughtful magazine app with floating glass panels, pick the second.

---

## 2. Colors

These are the *only* colors. Don't introduce new ones per tool — borrow from this palette.

| Token | Hex | When to use |
|---|---|---|
| `bg.DEFAULT` | `#FAF8F5` | Page background (warm off-white) |
| `bg.subtle` | `#F2EFE9` | Card hover, secondary surfaces |
| `bg.muted` | `#EBE7DF` | Dividers, inactive tabs |
| `ink.DEFAULT` | `#231F20` | Primary text, headings |
| `ink.soft` | `#4A4546` | Body text |
| `ink.muted` | `#807A7B` | Secondary text, captions |
| `ink.faint` | `#B0ABAC` | Placeholders, disabled |
| `accent.DEFAULT` | `#5AA6BB` | The teal-blue. Highlights, soft fills, selected indicators, decorative moments |
| `accent.deep` | `#2E6E84` | Buttons, links, focus rings (darker version for contrast/readability) |
| `accent.hover` | `#245A6D` | Hover state for `accent.deep` |
| `accent.soft` | `#E6F0F4` | Pale tint — selected backgrounds, success-ish surfaces |
| `line` | `#E5E1DA` | Borders, dividers |
| `danger` | `#B91C1C` | Destructive actions, errors only |

**The two-accent rule:** Use `accent.DEFAULT` when the goal is *decorative* — a selected tab indicator, a soft tinted card, a highlight. Use `accent.deep` when the goal is *action* — buttons, links the user clicks, focus rings. They read as the same color family, but `accent.deep` has enough contrast for white text on top.

The body sits beneath three large, soft color orbs (see section 4) — they're what gives the glass surfaces something to refract. They're set in the platform shell and don't need to be added per tool.

There's also a very subtle grain texture (~2% opacity) layered above the orbs but beneath the glass — reads as the paper surface behind everything. Leave it.

**Don't:** Add a new accent color per tool. Don't use green for "the inventory tool" and orange for "the admissions tool." Everything is the teal-blue.

---

## 3. Typography

Two fonts, no more.

- **Fraunces** (display) — page titles, big numbers in stat blocks, the occasional editorial flourish. Weight 400, letter-spacing `-0.02em`, line-height 1. Wider and warmer than a traditional serif — that's the point.
- **Geist Sans** (body) — everything else. UI labels, body copy, table cells, button text.

Use the `.display-heading` utility class for serif headings — don't reach for `<h1>` and hope.

**Sizing rough guide:**
- Page title: `text-4xl` to `text-5xl`, serif
- Section heading: `text-2xl`, serif OR sans-bold (pick one and stick with it within a tool)
- Card title: `text-lg`, sans-medium
- Body: `text-base`, sans
- Caption / metadata: `text-sm`, `ink-muted`

**Don't:** Use serif for buttons or form labels. Don't bold the serif — it loses its character.

---

## 4. Surfaces — the glass treatment

The platform uses a Liquid Glass-inspired surface treatment for interactive containers. Cards, buttons, the nav, modals, and stat tiles are translucent: backdrop-blurred, with a subtle inner top highlight (the "glass thickness" trick), soft drop shadows, and generous corner radii. They feel layered above the paper, not sitting flat on it.

**The trick that makes this work:** the body has a few large, very soft color orbs floating behind everything. They give the glass something to refract. Without them, the glass effect barely registers against the flat cream background — so the orbs are not optional, they're load-bearing.

### The base glass utility

Every interactive container starts from this. It lives in `globals.css` and is reused everywhere.

```css
.glass {
  background: rgba(255, 253, 250, 0.55);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.65),   /* inner top highlight */
    inset 0 -1px 0 0 rgba(35, 31, 32, 0.04),     /* subtle inner bottom */
    0 1px 2px rgba(35, 31, 32, 0.04),            /* contact shadow */
    0 12px 32px rgba(35, 31, 32, 0.06);          /* soft float shadow */
}
```

### The orbs (set once in `globals.css`)

```css
.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}
.orb-1 { top: -10%; left: -5%;  width: 500px; height: 500px;
         background: rgba(90, 166, 187, 0.28); }
.orb-2 { top: 30%;  right: -8%; width: 600px; height: 600px;
         background: rgba(46, 110, 132, 0.18); }
.orb-3 { bottom: -15%; left: 25%; width: 550px; height: 550px;
         background: rgba(180, 200, 170, 0.22); }
```

These render as three `<div class="orb orb-N">` elements at the top of `<body>`. They're built into the platform shell — individual tools never add or modify orbs.

### Corner radius scale

- Cards, modals, stat tiles, large surfaces → `20px` (`rounded-[20px]`)
- Buttons, nav bar, chips → full pill (`rounded-full`)
- Small inset elements (focus rings, tag fills) → `8-12px`
- Inputs stay borderless — they're editorial underlines, not boxed (no radius)

### When to use glass

| Use glass for | Don't use glass for |
|---|---|
| Cards, stat tiles, panels | Inputs (stay underlined) |
| The top nav (a floating pill) | Plain text blocks |
| Buttons (primary and ghost) | Tab underlines (stay editorial) |
| Modals, drawers, sheets | Backgrounds (let the paper show through) |
| Tooltips, popovers | Lines, dividers |
| Active row / selected indicators | Page-level wrappers |

### Layering rule

Don't nest glass inside glass. A button sitting on a glass card is fine (the button's own glass treatment is restrained enough). But a glass card inside a glass card creates muddy blur stacking and looks broken.

---

## 5. Components (already in `globals.css`)

These are pre-built. Use them. Don't reinvent.

### Buttons

Buttons are glass too. Primary uses a vertical gradient with inner top highlight and a soft teal glow shadow; ghost is a translucent panel.

```html
<button class="btn-primary">Save</button>
<button class="btn-ghost">Cancel</button>
```

```css
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 9999px;
  font-weight: 500; font-size: 0.95rem;
  padding: 0.7rem 1.5rem;
  background: linear-gradient(180deg, #2E6E84 0%, #245A6D 100%);
  color: #FAF8F5;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(35, 31, 32, 0.12),
    0 4px 16px rgba(46, 110, 132, 0.2);
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
    0 2px 4px rgba(35, 31, 32, 0.15),
    0 8px 24px rgba(46, 110, 132, 0.28);
}

.btn-ghost {
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 9999px;
  font-weight: 500; font-size: 0.95rem;
  padding: 0.6rem 1.3rem;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  color: #4A4546;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
  transition: background 200ms ease, color 200ms ease;
}
.btn-ghost:hover { background: rgba(255, 255, 255, 0.75); color: #231F20; }
```

One primary per view, max. Ghost for everything else.

For destructive actions: same shape, swap the gradient to red.

### Inputs

```html
<input class="input-field" placeholder="Hospital name" />
```

Inputs **don't** get the glass treatment. They stay editorial — no fill, no border, just a subtle bottom line that turns teal on focus. This contrast (calm underlined inputs sitting inside a glass card) is intentional.

```css
.input-field {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(229, 225, 218, 0.7);
  padding: 0.75rem 0;
  font-size: 1rem;
  color: #231F20;
  font-family: inherit;
  outline: none;
  transition: border-color 200ms;
}
.input-field::placeholder { color: #B0ABAC; }
.input-field:focus { border-bottom-color: #2E6E84; }
```

For multi-line: same class on `<textarea>`. For selects: native `<select>` with the same class is fine.

### Cards

```html
<div class="glass">
  ...
</div>
```

Cards are the `.glass` utility (defined in section 4). Subtle backdrop blur, edge highlight at the top, soft floating shadow. Don't nest glass inside glass.

### Top nav

The nav is a floating glass pill that sticks to the top, not a full-width bar:

```css
nav.top {
  position: sticky; top: 0; z-index: 50;
  margin: 1rem 1rem 0;
  padding: 0.75rem 1.5rem;
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(250, 248, 245, 0.55);
  backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 9999px;
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.7),
    0 4px 24px rgba(35, 31, 32, 0.05);
}
```

Active nav links get a translucent fill pill in `accent.soft` with an inner highlight.

### Tabs

Tabs stay editorial — underlined, not pilled. The active tab is `accent.deep` text with an `accent` (lighter) underline. Intentional contrast against the glass around them.

```css
.tabs {
  display: flex; gap: 1.75rem;
  border-bottom: 1px solid rgba(229, 225, 218, 0.7);
  margin-bottom: 1.75rem;
}
.tab {
  padding: 0.6rem 0;
  color: #807A7B;
  font-size: 0.9rem; font-weight: 500;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 200ms, border-color 200ms;
  cursor: pointer;
}
.tab.active { color: #2E6E84; border-bottom-color: #5AA6BB; }
.tab:hover:not(.active) { color: #4A4546; }
```

### Display headings

```html
<h1 class="display-heading text-5xl">Good evening, Sarah</h1>
```

---

## 6. Layout

**Every tool page has this structure:**

```
┌─ Top nav (provided by platform shell — don't rebuild) ─┐
│                                                          │
│   ┌─ Page heading (serif, large) ─┐                     │
│   │                                │                     │
│   └─ Subhead / context (ink-muted) ┘                     │
│                                                          │
│   ┌─ Content (one column on mobile, ─┐                  │
│   │  up to 2 columns on desktop)     │                  │
│   └──────────────────────────────────┘                  │
└──────────────────────────────────────────────────────────┘
```

- Max content width: `max-w-5xl` for dashboards, `max-w-2xl` for single-task tools (forms, the marketer view).
- Horizontal padding: `px-6` on mobile, `px-8` on desktop. Don't go edge-to-edge.
- Vertical rhythm: `space-y-8` between major sections, `space-y-4` between related items.

**Mobile-first.** Marketer-facing tools are used on phones in cars. Hit targets minimum `44px`. Fonts don't shrink below `14px` on mobile. Test at iPhone SE width (375px) before declaring anything done.

---

## 7. Three audiences, three feels

Tools serve different people. The aesthetic stays the same but the density and tone shift.

### Guest / external (e.g., marketer rounding log via bookmark URL)
- One thing per screen. Big buttons.
- Greeting by name (it's a delight moment — costs nothing).
- No login chrome, no nav clutter. Just the task.
- Mobile-first, single column always.
- Friendly microcopy: "Add a stop" not "Create new entry."

### Internal team (dashboard tools)
- Data-dense but breathable. Use tables, filters, date pickers.
- Sort and filter controls live in a top bar above the data.
- Empty states explain what would appear here ("No rounds logged today — they usually start coming in around 5 PM").
- Tabs for slicing the same data ("Today / This week / Going cold").

### Admin (settings, user management)
- Forms-heavy. Sectioned with clear headings.
- Confirmation modals for destructive things (delete facility, revoke marketer link).
- Generated values (like marketer URLs) get a copy-to-clipboard button and a visible "copied!" toast.

---

## 8. Microcopy & voice

- Speak like a smart colleague, not a help desk. "Looks like that hospital is new — we'll remember it" beats "Hospital not found in database. Saved as new entry."
- Use sentence case for all UI labels and buttons. ("Add stop," not "Add Stop.")
- Empty states are an opportunity, not a problem. Explain what *will* appear.
- Errors are calm and specific: "That bookmark link has expired — ask your admin for a new one" not "Error 403: Unauthorized."
- No emojis in UI labels. Save them for the very occasional success toast if you must.

---

## 9. States every tool needs

For every list/table/form, design these four states explicitly:

1. **Empty** — no data yet. Explain what will go here and what to do next.
2. **Loading** — skeleton bars in `bg.subtle`, not spinners. Spinners only for actions, not pages.
3. **Error** — calm tone, suggest a next step, never just "Something went wrong."
4. **Success** — confirmation that's brief and gets out of the way. A toast at the bottom that fades after ~3 seconds works for most things.

---

## 10. Iconography

Use **Lucide React** (`lucide-react`) for all icons. Don't mix icon libraries.

- Default size: `w-5 h-5` inline with text, `w-4 h-4` in dense table rows.
- Color: inherit from parent text color (`currentColor`). Don't hardcode icon colors.
- Stroke width: default. Don't beef them up.

---

## 11. Motion

Quiet, fast, purposeful. No bouncy springs, no slow fades.

- Hover transitions: `transition-colors` (the default Tailwind speed is right).
- Modal/drawer entrance: 200ms ease-out.
- Toast appearance: instant; disappearance: 300ms fade.
- **Don't** animate page transitions, scroll, or anything that delays the user getting to their task.

---

## 12. The tailwind config (already set up)

For reference if a new chat needs to recreate it:

```ts
// tailwind.config.ts
colors: {
  bg:     { DEFAULT: "#FAF8F5", subtle: "#F2EFE9", muted: "#EBE7DF" },
  ink:    { DEFAULT: "#231F20", soft: "#4A4546", muted: "#807A7B", faint: "#B0ABAC" },
  accent: {
    DEFAULT: "#5AA6BB",   // teal-blue — decorative
    deep:    "#2E6E84",   // for buttons, links, focus
    hover:   "#245A6D",
    soft:    "#E6F0F4",
  },
  line:   "#E5E1DA",
  danger: "#B91C1C",
},
fontFamily: {
  display: ["var(--font-display)", "serif"],   // Fraunces
  sans:    ["var(--font-sans)", "system-ui", "sans-serif"],  // Geist
},
```

And the component utilities live in `app/globals.css` under `@layer components`. Don't redefine them per tool — import from the shell.

**Notes for the platform shell:**

1. Font import in `app/layout.tsx`:

```ts
import { Fraunces, Geist } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-display",
  display: "swap",
});
```

2. `app/globals.css` needs the `.glass` utility (section 4), the three `.orb` rules (section 4), and the component classes (`.btn-primary`, `.btn-ghost`, `.input-field`, `nav.top`, `.tabs`/`.tab`) from section 5. The three orbs are rendered in `app/layout.tsx` as `<div class="orb orb-1"></div>` (etc.) at the top of `<body>`, before the `{children}` slot, so they sit behind every page.

---

## 13. Anti-patterns (things to actively avoid)

- ❌ Adding a new accent color for a new tool ("the admissions tool is purple")
- ❌ Using a boxed input style anywhere — they're all underlined
- ❌ Solid opaque cards — every card is glass; opacity ~55%, with backdrop blur
- ❌ Nesting glass inside glass (creates muddy blur stacking)
- ❌ Omitting the body orbs — without them the glass effect doesn't read
- ❌ Hard, sharp drop shadows (`box-shadow: 0 4px 8px black`) — glass shadows are soft and large (≥12px blur, low opacity)
- ❌ Neumorphism (the inner-shadow puffy look)
- ❌ Saturated/colorful gradient buttons — the only gradient is the subtle `accent.deep → accent.hover` on `.btn-primary`
- ❌ Emoji in headings or labels
- ❌ More than one primary button visible at once
- ❌ Modals stacked on modals
- ❌ Tables without empty/loading/error states
- ❌ "Click here" link text — always describe the destination
- ❌ Spinning loaders for whole-page loads (use skeletons)
- ❌ Pill-shaped tabs — tabs stay underlined (the one place we resist the glass pill aesthetic)

---

## 14. Quick checklist before shipping a new tool

- [ ] Uses only colors from the palette above
- [ ] Headings use `.display-heading` or sans-bold, no mixing
- [ ] Buttons are `.btn-primary` / `.btn-ghost`, max one primary visible
- [ ] Inputs are `.input-field` (underlined, not boxed)
- [ ] Cards / panels / stat tiles use the `.glass` utility (no opaque containers)
- [ ] No nested glass surfaces (a button on a glass card is fine; a glass card inside a glass card is not)
- [ ] Body orbs visible behind the content (inherited from the shell — don't remove)
- [ ] Tabs are underlined, not pilled
- [ ] Empty / loading / error / success states all designed
- [ ] Mobile-tested at 375px width
- [ ] Tap targets ≥ 44px on guest-facing views
- [ ] Lucide icons only, inheriting color
- [ ] Microcopy in sentence case, friendly-but-direct voice