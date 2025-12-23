import type { Metadata, Viewport } from 'next'
import WeatherBackground from '@/components/WeatherBackground'
import { Providers } from '@/components/Providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'AI-powered weather forecasting with smart insights',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <WeatherBackground />
          <div className="min-h-screen relative">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
