import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'
import React from 'react';
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: 'Community Website',
  description: 'A modern community platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <div suppressHydrationWarning>
            <Toaster position="top-right" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
