# Hero Panel Visual Parity & Portfolio Branding Alignment Plan

Restore the exact Hermes dark-mode visual atmosphere, cobalt `#0000f2` contrast hierarchy, engraved hero scale, and clean terminal widget composition from the reference screenshot while replacing remaining placeholder identity copy with **Dhrumil Asodiya** branding.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> All five visual and branding adjustments below were confirmed during discovery and will be applied together without altering the top-to-bottom theme scanline animation, scroll progress indicator, corner-fold triggers, or Trinity OS routes.

- **Confirmed Decision 1 — Restore Electric Cobalt Contrast**: Restore pure white CTA button backgrounds paired with `#0000f2` ink and restore vibrant `#0000f2` active tab fills inside a deep `#00008e` terminal container (replacing the muted pale lavender and desaturated navy dark-mode overrides).
- **Confirmed Decision 2 — Midnight Navy Canvas & Film-Grain Texture**: Deepen the primary hero/navigation canvas to a seamless midnight obsidian-blue (`#06061b` / `#0a0a21`), restore the subtle stippled noise overlay behind the hero composition, and keep the outer `5px` electric cobalt frame crisp.
- **Confirmed Decision 3 — Hero Proportions & Engraving Presence**: Expand hero vertical breathing room and enlarge the right-hand engraving artwork so it sits high alongside the top navigation edge with crisp silver contrast, removing heavy radial vignette clipping.
- **Confirmed Decision 4 — Clean Terminal Widget Header**: Remove the inline shortcut links (`Trinity OS (O)` and `Dark (X)`) sitting above the quick-profile terminal box so only the solo uppercase label remains, matching the reference layout while preserving `X` and `O` keyboard shortcuts and the corner-fold triggers.
- **Confirmed Decision 5 — Portfolio Identity Update**: Replace leftover placeholder identity copy in the header wordmark, dropdown headings, quick-profile command strings, and hero metadata with **Dhrumil Asodiya — Full-Stack Java Developer** details.

---

## 1. Overview & Core Concept

- **What It Does**: Aligns the primary above-the-fold portfolio hero and global header visually with the high-contrast Hermes Agent dark UI—pairing razor-sharp condensed display typography (`Rules Gothic Condensed`), pure `#ffffff` / `#0000f2` primary controls, a textured midnight-navy backdrop, and balanced full-height engraving artwork.
- **Target Audience / Persona**: Engineering recruiters, technical founders, and hiring managers evaluating Dhrumil Asodiya's full-stack Java and interactive frontend engineering craft within the first 3 seconds of page load.
- **Key Value**: Eliminates flat lavender washed-out contrast and extra UI chrome clutter above the terminal switcher so the visual focal hierarchy matches the crisp, editorial punch of the reference design.

---

## 2. User Experience & Visual Design

### Root Cause of Visual Differences vs. Reference Screenshot

1. **Accent Washout in Dark Mode**: Dark theme variable overrides previously reassigned brand text tokens on primary buttons to soft periwinkle (`#a3a3fa`) and darkened the active terminal tab background from `#0000f2` to `#000091`. As a result, primary white buttons looked muted and the terminal tab switcher lost its signature cobalt highlight.
2. **Canvas Flatness**: Unlike the lower page sections and footer that mount the procedural stippled noise layer over dark navy, the hero canvas rendered a flat solid background, and dark theme page wrappers mixed two slightly different midnight-navy tones between outer stage and inner marketing canvas.
3. **Hero Vertical Compression & Artwork Masking**: Compact padding vertically compressed the headline and action block while a tight radial ellipse mask softened and slightly boxed the engraving illustration.
4. **Extra Terminal Label Chrome**: Placing underlined keyboard hints (`Trinity OS (O)`, `Dark (X)`) inline with the `Quick profile` label crowded the compact spacing above the terminal tab group.

### Target Visual System

- **Aesthetic Direction**: Editorial brutalist-engineering landing panel—monumental vertical typography paired with razor-sharp hairline geometry, zero pill capsules, and high-contrast ink-on-void clarity.
- **Color Palette & Tokens**:
  - *Primary Canvas*: Seamless midnight navy (`#08081e` / `#0a0a21`) unified across header and hero stage, framed by a fixed `5px` electric cobalt viewport border (`--hermes-blue-light-20`).
  - *Primary Button Surfaces*: Solid high-luminance white (`#ffffff` / `#f4f4f8`) with vivid `#0000f2` label and icon ink, plus `currentColor` orbiting hairline hover borders.
  - *Secondary Ghost CTA*: Translucent cool smoke fill (`rgba(255, 255, 255, 0.2)`) with crisp `#f2f2f2` ink.
  - *Interactive Profile Terminal*: Outer shell in deep `#00008e` (`--hermes-blue-dark-40`), inactive tabs in muted translucent navy with underlined labels, active tab highlighted in saturated `#0000f2`.
- **Typography & Hierarchy**:
  - *Center Header Wordmark*: Stacked two-line uppercase `Rules Gothic Compressed` (`DHRUMIL / ASODIYA`) centered between balanced pairs of `14px` `Rules Condensed` sub-navigation triggers.
  - *Hero Display Title*: Asymmetric three-line `Rules Gothic Condensed` headline at `clamp(3.25rem, 8.2vw, 108px)`, tight `0.94` line-height, and `-0.02em` tracking.
  - *Meta & Terminal Copy*: `Aeonik Fono Pro TRIAL` mono tabular styling for the uppercase `QUICK PROFILE` label and interactive command/stack output.
- **Interactive Feedback & Motion**:
  - Smooth underline expansion on sub-navigation triggers (`cubic-bezier(0.16, 1, 0.3, 1)`), orbiting hairline hover borders on CTA buttons, interactive split dropdown menu, clipboard copy confirmation check icon, and intact corner-fold `X` (theme wipe) and `O` (Trinity OS CRT bootloader) entry transitions.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Restore `#0000f2` Exclusively on High-Contrast White Surfaces & Terminal Active Tabs**
  - *Chosen Approach*: Keep readable light-blue links (`--marketing-dark-link`) on dark background prose/links where `#0000f2` would fail contrast, while explicitly forcing `#0000f2` on white-background CTA buttons (`data-variant="secondary"`) and on the active tab inside the profile terminal widget.
  - *Why*: Achieves both WCAG AA legibility on dark prose and exact punchy cobalt accent parity with the reference screenshot.
  - *Alternatives Considered*: Switching `--hpv2-brand` back to `#0000f2` globally, which would make dark-mode paper headings and links unreadable on dark backgrounds.

- **Decision 2 — Move Shortcut Discoverability Out of the Hero Terminal Header**
  - *Chosen Approach*: Keep `Quick profile` as a solo clean uppercase label matching `INSTALL VIA TERMINAL`, leaving `X` (theme) and `O` (Trinity OS) accessible via top-right/bottom-right corner folds, keyboard shortcuts, and navigation dropdown/footer entries.
  - *Why*: Preserves the clean editorial vertical rhythm of the hero left column without losing any functionality or discoverability.
  - *Alternatives Considered*: Keeping badge toggles or hint links inline above the terminal, which visually crowds the hero stack.

- **Decision 3 — Larger Full-Bleed Engraving with Gentle Screen Blending**
  - *Chosen Approach*: Increase `.landing-hero` vertical presence to match the full above-the-fold desktop frame, enlarge the engraving height/width scaling slightly upward, use clean `mix-blend-mode: screen` (in dark mode) over the textured `#08081e` midnight canvas, and relax the radial fade mask so etching lines stay crisp to the edges.
  - *Why*: Recreates the dramatic edge-to-edge architectural gravure feel shown in the right half of the reference image.
  - *Alternatives Considered*: Keeping compact hero spacing and strict box clipping, which leaves excess dark margin around the illustration.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Portfolio Root Shell  [5px Electric Cobalt Frame + Midnight Noise Stage]  │
│  ├── ThemeFold (Top-Right, Key: X)      OSFold (Bottom-Right, Key: O)     │
├───────────────────────────────────────────────────────────────────────────┤
│ Header Navigation Grid  [1fr | auto | 1fr]                                │
│  ├── Left: About, Work                                                    │
│  ├── Center Wordmark: DHRUMIL / ASODIYA (Pinned scroll -> Wing SVG)       │
│  └── Right: Writing, Connect + White Secondary CTA (#0000f2 ink)          │
├─────────────────────────────────────┬─────────────────────────────────────┤
│ Hero Left Column                    │ Hero Right Column                   │
│  ├── 3-Line Display H1              │  └── Full-Height Engraving Artwork  │
│  ├── Primary Split CTA + Ghost CTA  │      Screen-blended over noise-     │
│  └── Clean Solo Label: QUICK PROFILE│      textured midnight canvas       │
│      ├── Tab Switcher (bio/stack/…) │                                     │
│      │   Active Tab: #0000f2 Cobalt │                                     │
│      └── Copyable Monospace Output  │                                     │
└─────────────────────────────────────┴─────────────────────────────────────┘
```

### Data Model & Identity Updates

- **Portfolio Profile Configuration**: Update core identity fields (`firstName: 'Dhrumil'`, `lastName: 'Asodiya'`, `fullName: 'Dhrumil Asodiya'`, role `'Full-Stack Java Developer'`), header popover category headings, and `QUICK_TABS` default strings (`bio`, `stack`, `contact`) so every visible string in the header and hero terminal belongs authentically to Dhrumil Asodiya's engineering portfolio.
- **CSS Theme Variable Scope**: Separate surface background ink from text/link accent ink cleanly under `html[data-marketing-theme="dark"]` so secondary white buttons always receive `#0000f2` text and `.hw-install-terminal-body` retains `#00008e` container chrome with `#0000f2` active tab state.

### Interactive Component & State Mapping

- **Header Sub-Navigation Popover**: Clicking `About`, `Work`, `Writing`, or `Connect` calculates button anchor bounds and toggles the dark popover menu; selecting any destination scrolls smoothly or opens the contact modal (`onOpenContact`).
- **Hero Action Split Menu**: Main button scrolls directly to `#projects` selected case studies; adjacent chevron button toggles the quick-jump dropdown with `Escape` and outside-click dismissal.
- **Quick Profile Switcher & Copy Handler**: Selecting `bio`, `stack`, or `contact` updates displayed monospace profile command text; clicking the copy affordance copies text via `navigator.clipboard.writeText` and toggles crisp pixel confirmation feedback.
- **Hero Noise Backdrop**: Dedicated `.hw-noise` background plane sits behind hero columns (`pointer-events-none`, `z-0`) matching the subtle stipple finish visible across the reference dark hero panel.
