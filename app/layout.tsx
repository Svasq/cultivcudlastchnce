import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'
import React from 'react';
import { ThemeProvider } from "@/components/theme-provider"
export const metadata: Metadata = {
  title: 'Community Platform',
  description: 'A modern community platform for streaming and connecting',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen">{children}</main>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
