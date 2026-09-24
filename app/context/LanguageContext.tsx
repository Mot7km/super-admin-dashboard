import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import en from '../../src/locales/en.json'
import ar from '../../src/locales/ar.json'

type Locale = 'en' | 'ar'
type TranslationDictionary = Record<string, unknown>

type LanguageContextValue = {
  locale: Locale
  t: (key: string) => string
  toggleLocale: () => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const dictionaries: Record<Locale, TranslationDictionary> = {
  en: en as TranslationDictionary,
  ar: ar as TranslationDictionary,
}

const getNestedValue = (dictionary: TranslationDictionary, key: string) => {
  return key.split('.').reduce<TranslationDictionary | string | undefined>((acc, part) => {
    if (typeof acc === 'object' && acc !== null && part in acc) {
      return acc[part] as TranslationDictionary | string | undefined
    }

    return undefined
  }, dictionary) as string | undefined
}

const resolveInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return 'en'

  const storedLocale = window.localStorage.getItem('app-locale')
  if (storedLocale === 'en' || storedLocale === 'ar') {
    return storedLocale
  }

  return navigator.language.toLowerCase().startsWith('ar') ? 'ar' : 'en'
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>(resolveInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    window.localStorage.setItem('app-locale', locale)
  }, [locale])

  const t = (key: string) => {
    const value = getNestedValue(dictionaries[locale], key)
    return value ?? key
  }

  const toggleLocale = () => {
    setLocale((current) => {
      const next = current === 'en' ? 'ar' : 'en'
      window.localStorage.setItem('app-locale', next)
      return next
    })
  }

  const value = useMemo(
    () => ({ locale, t, toggleLocale }),
    [locale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useTranslation = () => {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }

  return context
}
