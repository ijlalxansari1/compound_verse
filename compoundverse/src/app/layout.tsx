
import type { Metadata } from 'next'
import './globals.css'
import QueryProvider from '@/providers/QueryProvider'
import AuthListener from '@/providers/AuthListener'

export const metadata: Metadata = {
  title: "CompoundVerse - Small Wins Compound Quietly",
  description: "A calm, ethical life system for consistent growth across health, faith, and career",
  icons: {
    icon: '/favicon.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`antialiased bg-[#0a0a0f] text-white min-h-screen font-sans`}
      >
        <QueryProvider>
          <AuthListener />
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
