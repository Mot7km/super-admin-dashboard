/**
 * Mot7km Super Admin Dashboard — Core Color Tokens & Semantic Mappings
 * TypeScript Theme Tokens for Next.js / Tailwind CSS
 */

export const brandColors = {
  primary: {
    DEFAULT: '#1D4ED8', // Main brand blue (Light mode primary)
    dark: '#1E40AF',
    light: '#38BDF8', // Luminous sky blue (Dark mode primary)
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },
  secondary: {
    DEFAULT: '#0D9488', // Operational teal (Management & table metrics)
    dark: '#0F766E',
    light: '#2DD4BF',
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
    950: '#042F2E',
  },
  accent: {
    DEFAULT: '#06B6D4', // Highlights, smart features, AI extracts
    dark: '#0891B2',
    light: '#67E8F9',
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
    950: '#083344',
  },
} as const;

export const statusColors = {
  success: {
    DEFAULT: '#10B981',
    dark: '#059669',
    light: '#34D399',
    bgLight: '#ECFDF5',
    bgDark: 'rgba(16, 185, 129, 0.18)',
    textLight: '#059669',
    textDark: '#34D399',
  },
  warning: {
    DEFAULT: '#F59E0B',
    dark: '#D97706',
    light: '#FBBF24',
    bgLight: '#FFFBEB',
    bgDark: 'rgba(245, 158, 11, 0.18)',
    textLight: '#D97706',
    textDark: '#FBBF24',
  },
  error: {
    DEFAULT: '#EF4444',
    dark: '#DC2626',
    light: '#F87171',
    bgLight: '#FEF2F2',
    bgDark: 'rgba(239, 68, 68, 0.18)',
    textLight: '#DC2626',
    textDark: '#F87171',
  },
  info: {
    DEFAULT: '#06B6D4',
    dark: '#0891B2',
    light: '#38BDF8',
    bgLight: '#ECFEFF',
    bgDark: 'rgba(6, 182, 212, 0.18)',
    textLight: '#0891B2',
    textDark: '#38BDF8',
  },
} as const;

export const chartColors = [
  '#1683C7', // Blue
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#64748B', // Slate
] as const;

export const semanticTokens = {
  light: {
    background: '#F8FAFC',
    foreground: '#0F172A',
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9',
    card: '#FFFFFF',
    cardForeground: '#0F172A',
    cardBorder: 'rgba(15, 23, 42, 0.08)',
    cardBorderStrong: 'rgba(15, 23, 42, 0.14)',
    cardShadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
    popover: '#FFFFFF',
    popoverForeground: '#0F172A',
    primary: '#1D4ED8',
    primaryForeground: '#FFFFFF',
    secondary: '#0D9488',
    secondaryForeground: '#FFFFFF',
    accent: '#06B6D4',
    accentForeground: '#FFFFFF',
    muted: '#F1F5F9',
    mutedForeground: '#64748B',
    border: '#E2E8F0',
    input: '#E2E8F0',
    ring: '#1D4ED8',
    badgeBackground: '#F1F5F9',
    badgeForeground: '#334155',
  },
  dark: {
    background: '#0B0F19',
    foreground: '#F9FAFB',
    surface: '#111827',
    surfaceSubtle: '#1E293B',
    card: '#1F2937',
    cardForeground: '#F9FAFB',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    cardBorderStrong: 'rgba(255, 255, 255, 0.20)',
    cardShadow: '0 4px 16px rgba(0, 0, 0, 0.40)',
    popover: '#111827',
    popoverForeground: '#F9FAFB',
    primary: '#38BDF8',
    primaryForeground: '#0B0F19',
    secondary: '#2DD4BF',
    secondaryForeground: '#0B0F19',
    accent: '#67E8F9',
    accentForeground: '#0B0F19',
    muted: '#1E293B',
    mutedForeground: '#9CA3AF',
    border: 'rgba(255, 255, 255, 0.12)',
    input: 'rgba(255, 255, 255, 0.14)',
    ring: '#38BDF8',
    badgeBackground: '#334155',
    badgeForeground: '#E5E7EB',
  },
} as const;

export type ThemeTokens = typeof semanticTokens.light;
