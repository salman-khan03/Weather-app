import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'AI-powered weather forecasting with smart insights',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-primary">
          {children}
        </div>
      </body>
    </html>
  )
}
