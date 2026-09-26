/**
 * Mot7km Super Admin — Metric Sizing, Padding & Radius Tokens
 *
 * Design Invariant:
 * Strictly avoids overly circular / bubbly radii (no 9999px pills where crisp tags belong).
 * Standardizes card radii to 12px (rounded-xl) with precision hierarchical scaling.
 */

export const SIZES = {
  /**
   * Border Radii Tokens
   * Standard: 12px for primary containers and cards.
   */
  radius: {
    none: '0px',
    xs: '4px',     // Micro badges, indicators
    sm: '6px',     // Sub-tags, inner progress gauges, small badges
    md: '8px',     // Buttons, inputs, dropdown items, status tags (was rounded-full)
    lg: '10px',    // Interactive control pills, icon containers
    xl: '12px',    // Standard Cards, Main Panels, Modal Dialogs (PRIMARY STANDARD)
    '2xl': '14px', // Floating overlays, sheet panels
  },

  /**
   * Standardized Tailwind Class mappings for rapid UI consistency
   */
  classes: {
    // Containers & Surfaces
    card: 'rounded-xl',           // 12px - Standard for all KPI & data cards
    cardInner: 'rounded-lg',      // 8px-10px - Inner grouped surfaces
    modal: 'rounded-xl',          // 12px - Dialogs and popups
    popover: 'rounded-xl',        // 12px - Flyouts & tooltips

    // Controls & Inputs
    button: 'rounded-lg',         // 8px - Action buttons & toolbars
    input: 'rounded-lg',          // 8px - Form fields & search inputs
    segmentedTrack: 'rounded-xl', // 12px - Segmented control outer track
    segmentedPill: 'rounded-lg',  // 8px - Segmented control inner active tab

    // Micro UI & Badges (Clean executive tags instead of bubbly circular pills)
    tag: 'rounded-lg',            // 8px - Status tags & delta pills
    badge: 'rounded-md',          // 6px - Dense count badges
    iconSquircle: 'rounded-xl',   // 12px - Themed icon containers
    subSquircle: 'rounded-lg',    // 8px - Secondary action icon boxes
  },

  /**
   * Standard Paddings & Spacing
   */
  padding: {
    card: 'p-4 sm:p-5',
    cardCompact: 'p-3 sm:p-4',
    cardDense: 'p-2.5 sm:p-3',
    sectionHeader: 'pb-5 pt-1',
    toolbar: 'p-1',
    input: 'px-3 py-2 text-xs',
    button: 'px-3.5 py-2 text-xs',
    buttonSm: 'px-2.5 py-1.5 text-xs',
    tag: 'px-2.5 py-0.5 text-xs',
    badge: 'px-2 py-0.5 text-[10px]',
  },

  /**
   * Layout Grid & Stack Gaps
   */
  gap: {
    kpiGrid: 'gap-3.5 sm:gap-4',
    contentStack: 'space-y-4 sm:space-y-6',
    controlsRow: 'gap-2 sm:gap-2.5',
    inlineIcon: 'gap-2',
  },
} as const;

export type SizesConfig = typeof SIZES;
