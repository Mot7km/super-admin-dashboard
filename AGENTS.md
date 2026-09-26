# Mot7km ERP Super Admin — Agent Guidelines & Invariant Rules

Welcome to the **Mot7km ERP Super Admin Dashboard** codebase. All AI coding agents operating on this repository **MUST** adhere to the guidelines and mandatory component reuse policies specified in this document.

---

## 🎯 1. Mandatory Component Reuse Policy

To preserve design excellence, visual consistency, and clean code architecture across the entire dashboard, **NEVER** build ad-hoc HTML/Tailwind duplicates of existing core systems. Always use the established custom components detailed below.

### 📊 A. KPI Cards System (`src/components/common/kpi/`)

Whenever building or refactoring dashboard screens, overview pages, or module metric strips, you **MUST** import and use one of the two standardized KPI components:

```tsx
import { TelemetryKpiCard, SparklineKpiCard } from '@/components/common/kpi';
// or relative: import { TelemetryKpiCard, SparklineKpiCard } from '../../../common/kpi';
```

#### 1. `TelemetryKpiCard` (Progress, Status & Operational Filters)
- **When to use**: Status monitoring, progress tracking, quota usages, and interactive list filter strips (e.g., in `Businesses`, `Users`, `Subscriptions`, `System Health`).
- **Core Capabilities**:
  - Top ambient glowing accent bar (`primary`, `success`, `warning`, `destructive`, `cyan`, `purple`).
  - Badge with live ping pulse (`isLive: true`), trend indicator (`trend: 'up' | 'down'`), or custom icons.
  - Telemetry Progress Gauge with smooth animated fill percentage.
  - Footer metric row with separator border for secondary context (e.g., MRR contribution, active ratio).
  - Interactive click mode (`role="button"`, `onClick`, keyboard `Enter`/`Space`, `isActive` highlight ring).

**Example Usage:**
```tsx
<TelemetryKpiCard
  title={t('businesses.kpiActive')}
  value={activeCount}
  subValue={`${activeBranches} Branches (${activePercent}%)`}
  icon={CheckCircle2}
  variant="success"
  badge={{ text: '99.4% Uptime', isLive: true }}
  progress={{ value: activePercent }}
  footer={{
    label: 'Operational MRR',
    value: `$${activeMrr.toLocaleString()} /mo`,
  }}
  isActive={activeStatus === 'active'}
  onClick={() => handleCardClick('active')}
/>
```

#### 2. `SparklineKpiCard` (Executive Trends & Micro-Charts)
- **When to use**: Executive summary views, financial telemetry, and trend analytics over time (e.g., in `Home Overview`, `Analytics Hub`).
- **Core Capabilities**:
  - Embedded responsive SVG micro `AreaChart` with theme-calibrated `linearGradient` fill.
  - Minimalist theme-aware hover tooltip.
  - Trend delta pill with direction arrows and period comparison (e.g., `+14.8% MoM`, `vs last month`).
  - Secondary metric subtitle (e.g., `ARR: $1.54M`).

**Example Usage:**
```tsx
<SparklineKpiCard
  title={t('home.mrr')}
  value="$128,450"
  change="+14.8%"
  changeTrend="up"
  changeLabel="MoM"
  subValue="ARR: $1.54M"
  icon={DollarSign}
  variant="primary"
  data={mrrData}
  dataKey="value"
  formatTooltip={(val) => `$${val.toLocaleString()}`}
/>
```

---

### 🗂️ B. Sidebar Hierarchical Navigation (`SidebarNavCollapsible.tsx`)

Whenever adding a multi-page section or hierarchical menu to the Super Admin sidebar, you **MUST** use `SidebarNavCollapsible`:

```tsx
import { SidebarNavCollapsible } from '@/components/layout/SidebarNavCollapsible';
```

- **Pattern**: Option 1 *"Modern Inset Card & Glowing Rail"*.
- **Features**:
  - Inset card container with vertical rail track and glowing dot for the active sub-item.
  - Automatic Flyout Popover with hover bridge when sidebar is collapsed.
  - Smart route matching supporting root paths and index tabs.
  - Clean separation: eliminate redundant horizontal tabs inside pages, syncing active state via URL params (`/:tab`, `/:role`) and header breadcrumb badges.
- **Current Implementations**:
  - `System` (Feature flags, Announcements, Settings, Storage, Integrations, Health).
  - `Analytics` (Overview, Growth, Subscriptions, Trials, Product, Operations).
  - `Users` (All Users, Super Admins, Support Staff, Business Owners, Branch Managers, Cashiers).

---

### 🏛️ C. Standard Page Header System (`PageHeader.tsx`)

Whenever building or refactoring the top header of any dashboard screen or module, you **MUST** use `PageHeader`:

```tsx
import { PageHeader } from '@/components/common/header';
// or relative: import { PageHeader } from '../../../common/header';
```

- **Features**:
  - Themed Icon Squircle (`primary`, `secondary`, `emerald`, `amber`, `purple`, `cyan`).
  - Title with font-black tracking-tight typography.
  - Active Section / Breadcrumb Badge (`breadcrumb="/ Subscriptions"`).
  - Live Node & Health Status Badges with animated pulse and rich hover tooltip.
  - Responsive Segmented Timeframe Switcher (`today`, `7d`, `30d`, `quarter`, `ytd`).
  - Quick utility action buttons (Live refresh with spinning feedback, Export report).
  - High-impact Primary Action CTA button with optional shortcut badge (`+N`).
  - Dual-tier adaptive layout that never cramps on tablets or mobile.

**Example Usage:**
```tsx
<PageHeader
  title={t('dashboard.title')}
  subtitle={t('dashboard.subtitle')}
  icon={LayoutDashboard}
  iconVariant="primary"
  badges={[
    { text: 'Systems: 99.98% Live', isLive: true, variant: 'success', tooltip: 'Mesh Network Active • 24ms Ping' },
    { text: 'Root Sentinel Active', icon: Shield, variant: 'primary' },
  ]}
  timeFilter={{
    value: timeFilter,
    options: timeOptions,
    onChange: setTimeFilter,
  }}
  onRefresh={handleRefresh}
  isRefreshing={isRefreshing}
  onExport={handleExport}
  primaryAction={{
    label: t('dashboard.onboardTenant'),
    icon: Plus,
    badge: '+N',
    onClick: handleOnboard,
  }}
/>
```

---

### 📏 D. Sizing, Radii & Spacing Token Architecture (`src/theme/sizes.ts`)

To ensure visual crispness and eliminate bubbly/circular UI elements, all components **MUST** adhere to the standardized sizing tokens in `src/theme/sizes.ts`:

```tsx
import { SIZES } from '@/theme';
```

- **Core Radii Invariants**:
  - **Cards & Primary Panels**: **12px** (`rounded-xl` or `SIZES.classes.card`). Oversized (>14px) or bubbly circular cards are strictly prohibited.
  - **Themed Icon Squircles**: **12px** (`rounded-xl` or `SIZES.classes.iconSquircle`).
  - **Buttons & Form Inputs**: **8px** (`rounded-lg` or `SIZES.classes.button`, `SIZES.classes.input`).
  - **Segmented Control Switchers**: Outer track **12px** (`rounded-xl`), inner active tab pill **8px** (`rounded-lg`).
  - **Badges, Delta Indicators & Tags**: **8px** (`rounded-lg` or `SIZES.classes.tag`). **NEVER** use `rounded-full` (9999px bubble pills) for status tags and metrics; use crisp 8px executive tags.
  - **Inner Progress Gauges**: **6px** (`rounded-md`).
- **Standard Paddings & Gaps**:
  - Card padding: `p-4 sm:p-5` (`SIZES.padding.card`).
  - KPI Grid spacing: `gap-3.5 sm:gap-4` (`SIZES.gap.kpiGrid`).
  - Page header spacing: `pb-5 pt-1` (`SIZES.padding.sectionHeader`).

---

## 🎨 2. UI/UX Design & Theming Invariants

1. **Light & Dark Mode**:
   - Always use semantic color tokens defined in `app/index.css` (e.g., `bg-card`, `bg-surface`, `text-foreground`, `text-muted-foreground`, `border-border/80`).
   - Never hardcode raw hex backgrounds (like `#ffffff` or `#000000`) on UI containers.

2. **RTL & LTR Bi-directional Support**:
   - Use logical spacing utilities: `ms-*` / `me-*` or `rtl:*` variants where needed.
   - Text alignment: `text-left rtl:text-right`.
   - All directional icons (arrows, chevrons, panels) must adapt appropriately to Arabic (`rtl`) and English (`ltr`).

3. **Typography**:
   - Use tabular numbers for metrics: `font-mono tabular-nums`.
   - Large figures: `font-black text-2xl sm:text-3xl tracking-tight`.

4. **Micro-Interactions**:
   - Interactive elements must have smooth hover transitions: `transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`.
   - Never remove focus rings without providing accessible `focus-visible` states.

---

## 🛡️ 3. Code Quality & Build Verification Rules

1. **Strict TypeScript (`tsc -b`)**:
   - Unused imports or variables will trigger compilation failures under strict settings.
   - Always verify code with `npx tsc -b` and ensure an exit code of `0` before completing any task.

2. **Localization Keys (`en.json` & `ar.json`)**:
   - Never leave raw hardcoded English text or raw dictionary keys in user-facing components.
   - Whenever introducing new labels, KPI titles, or column names, update **BOTH** `src/locales/en.json` and `src/locales/ar.json`.

3. **Performance & Memoization**:
   - Wrap presentational and list sub-components in `memo()`.
   - Memoize callback handlers passed down to cards with `useCallback()`.
