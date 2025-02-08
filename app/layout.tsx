import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'
import React from 'react';

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
      <body>{children}
        <div suppressHydrationWarning>
          <Toaster position="top-right" />
        </div>
      </body>
    </html>
  )
}
