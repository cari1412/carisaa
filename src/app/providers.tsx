// app/providers.tsx
'use client'

import {HeroUIProvider} from '@heroui/system'
import {useRouter} from 'next/navigation'
import {ThemeProvider as NextThemesProvider} from "next-themes";

export function Providers({children}: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <HeroUIProvider 
        navigate={router.push}
      >
        {children}
      </HeroUIProvider>
    </NextThemesProvider>
  )
}