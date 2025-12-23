'use client'

import Link from 'next/link'
import { Cloud, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <Cloud size={80} className="text-white mx-auto mb-4 opacity-50" />
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-xl text-white opacity-80 mb-8">
            Oops! The page you're looking for seems to have drifted away like a cloud.
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-opacity-90 transition-all"
          >
            <Home size={20} />
            <span>Go Home</span>
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-10 text-white rounded-lg font-bold hover:bg-opacity-20 transition-all"
          >
            <Search size={20} />
            <span>Learn More</span>
          </Link>
        </div>

        <div className="mt-12 text-white opacity-60 text-sm">
          <p>Lost? Try searching for a city to check the weather!</p>
        </div>
      </div>
    </div>
  )
}
