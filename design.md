# Mot7km ERP — Design System & Theme Architecture

This document defines the core visual design tokens, Tailwind CSS v4 setup, responsive layout rules, theming (Light/Dark mode), and localization (RTL/LTR & Cairo/Roboto typography) for **Mot7km ERP**.

---

## 🎨 1. Theme Configuration & Color Tokens

### Tailwind CSS v4 `@theme inline` Setup
The application leverages Tailwind CSS v4 with custom variable mapping defined in `src/index.css`:

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-primary: var(--primary);
  --color-primary-dark: var(--primary-dark);
  --color-primary-light: var(--primary-light);

  --color-secondary: var(--secondary);
  --color-secondary-dark: var(--secondary-dark);
  --color-secondary-light: var(--secondary-light);

  --color-accent: var(--accent);
  --color-accent-dark: var(--accent-dark);
  --color-accent-light: var(--accent-light);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  
  --color-card: var(--card);
  --color-elevated: var(--elevated);

  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  --color-text-on-primary: var(--text-on-primary);

  --font-cairo: 'Cairo', sans-serif;
  --font-roboto: 'Roboto', sans-serif;
  --font-sans: 'Cairo', 'Roboto', system-ui, -apple-system, sans-serif;
}
```

### Color Palette Matrix

| Token Name | Light Theme (`:root`) | Dark Theme (`.dark`) | Usage / Role |
| :--- | :--- | :--- | :--- |
| `--primary` | `#1683C7` | `#1683C7` | Primary brand accent & active states |
| `--primary-dark` | `#0B5A8A` | `#0B5A8A` | Hover / pressed primary state |
| `--primary-light` | `#22D3EE` | `#22D3EE` | Glow / highlight accents |
| `--secondary` | `#0F766E` | `#0F766E` | Secondary badges & status elements |
| `--secondary-dark` | `#115E59` | `#115E59` | Darker teal accents |
| `--secondary-light` | `#2DD4BF` | `#2DD4BF` | Lighter teal highlights |
| `--accent` | `#06B6D4` | `#06B6D4` | Gradient middle tone & badges |
| `--background` | `#F1F4F8` | `#0B0F17` | Softer background (eye-friendly) |
| `--foreground` | `#1E293B` | `#E2E8F0` | Default body text color |
| `--surface` | `#F8FAFC` | `#111827` | Sidebar, Topbar, Panel background |
| `--card` | `#FFFFFF` | `#161F33` | KPI cards, Chart containers, Tables |
| `--elevated` | `#E2E8F0` | `#1E293B` | Hover states, active items & popovers |
| `--text-primary` | `#1E293B` | `#E2E8F0` | Main headings & bold titles |
| `--text-secondary` | `#475569` | `#94A3B8` | Subtitles, labels & body text |
| `--text-muted` | `#64748B` | `#64748B` | Dates, timestamps, placeholders |
| `--text-on-primary` | `#FFFFFF` | `#FFFFFF` | Text rendered on primary buttons |

---

## 🌍 2. Typography & Localization (RTL / LTR)

### Font Specifications
- **Arabic (`dir="rtl"`)**: `Cairo` font family for clean readability across all font weights (300 to 800).
- **English (`dir="ltr"`)**: `Roboto` font family for modern interface presentation.

### Dynamic RTL / LTR HTML Injection
`src/context/LanguageContext.tsx` automatically manages `lang` and `dir` attributes on `document.documentElement`:

```tsx
useEffect(() => {
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
}, [locale]);
```

---

## 🎛️ 3. Gradient Utilities & Effects

- **Brand Gradient**: `.bg-brand-gradient` — `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)`
- **Primary Gradient**: `.bg-primary-gradient` — `linear-gradient(to bottom right, var(--primary), var(--secondary), var(--accent))`
- **Accent Gradient**: `.bg-accent-gradient` — `linear-gradient(to bottom right, var(--accent), var(--primary-light))`
- **Text Gradient**: `.text-gradient` — Text clipped gradient effect.
- **Scroll Fade Mask**: `.scroll-fade-mask` — Fades horizontal scroll container edges.
- **Safe Area Padding**: `.safe-padding` — Handles mobile notched screens safely.

---

## 🔒 4. Architecture & Context Files

1. **`src/context/ThemeContext.tsx`**: Manages light/dark mode state and syncs with `localStorage` and `classList.toggle('dark')`.
2. **`src/context/LanguageContext.tsx`**: Manages locale state (`ar` / `en`) and dictionary lookup from `src/locales/`.
3. **`src/index.css`**: Defines CSS tokens, `@theme inline`, `@variant dark`, font family fallbacks, and custom utility classes.
