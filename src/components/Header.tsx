'use client'

import { Cloud } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cloud size={32} className="text-white" />
          <h1 className="text-3xl font-bold text-white">WeatherAI</h1>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#" className="text-white hover:text-opacity-80 transition-all">
            Home
          </a>
          <a href="#" className="text-white hover:text-opacity-80 transition-all">
            About
          </a>
          <button className="btn-primary">Sign In</button>
        </nav>
      </div>
    </header>
  )
}
