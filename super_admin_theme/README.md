# Mot7km Super Admin Dashboard — Next.js Theme Integration Guide

This directory contains the ready-to-use design system tokens and styling configs for building the **Mot7km Super Admin Dashboard** in **Next.js 14 / 15** (App Router) with **Tailwind CSS**.

---

## 📁 File Structure

- `theme.css`: CSS Variables for `:root` and `.dark` (drop into `app/globals.css`).
- `tailwind.config.ts`: Tailwind configuration with HSL tokens, radii, shadows, and animations.
- `colors.ts`: TypeScript constants, raw hex palettes, status colors, and chart tokens.
- `theme-tokens.json`: Universal Design Tokens in W3C format.

---

## 🚀 Quick Setup in Your Next.js Project

### 1. Fonts Configuration (`app/layout.tsx`)
Mot7km uses **Cairo** for Arabic and **Roboto / Outfit** for English. Use `next/font/google`:

```tsx
// app/layout.tsx
import { Cairo, Roboto, Outfit } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['400', '500', '700', '900'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} ${roboto.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### 2. Next Themes Provider (`components/theme-provider.tsx`)
```tsx
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

---

### 3. Usage with Tailwind Classes in Components

```tsx
// Metric KPI Card Example
export function KpiCard({ title, value, change }: { title: string; value: string; change: number }) {
  const isPositive = change >= 0;

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-ambient">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-pill text-xs font-bold ${
          isPositive ? 'bg-success-bg text-success-text' : 'bg-destructive-bg text-destructive-text'
        }`}>
          {isPositive ? `+${change}%` : `${change}%`}
        </span>
      </div>
      <div className="mt-3 text-2xl font-extrabold text-foreground">{value}</div>
    </div>
  );
}
```

---
*Generated for Mot7km Super Admin Dashboard.*
