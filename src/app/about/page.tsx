'use client'

import Link from 'next/link'
import { Cloud, Sparkles, Globe, Zap, Shield, Heart, ArrowLeft } from 'lucide-react'
import Reviews from '@/components/Reviews'

export default function About() {
  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white border-opacity-20 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Cloud size={32} className="text-white" style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))'
              }} />
              <span className="text-2xl font-bold text-strong-contrast">WeatherApp</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-strong-contrast hover:opacity-80 transition-all">
              <ArrowLeft size={20} />
              <span className="font-bold">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center card fade-in">
            <div className="text-6xl mb-6">☁️⛈️🌤️</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-strong-contrast">
              About WeatherApp
            </h1>
            <p className="text-xl text-glass max-w-3xl mx-auto leading-relaxed">
              Your ultimate weather companion with stunning 3D animations, AI-powered insights, 
              and real-time forecasts. Experience weather like never before.
            </p>
          </div>

          {/* Mission Section */}
          <div className="card fade-in">
            <h2 className="text-3xl font-bold mb-6 text-strong-contrast flex items-center gap-3">
              <Heart size={32} className="text-red-400" />
              Our Mission
            </h2>
            <p className="text-lg text-glass leading-relaxed">
              At WeatherApp, we believe checking the weather should be more than just numbers and icons. 
              We've created an immersive experience that combines cutting-edge technology with beautiful 
              design. Our 3D animated weather backgrounds bring conditions to life—watch rain actually fall, 
              snow drift down, and the sun glow warmly. With AI-powered insights from Google Gemini, 
              we don't just tell you the weather; we help you understand it and make better decisions.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-bold mb-3 text-strong-contrast flex items-center gap-2">
                <Sparkles size={24} className="text-yellow-400" />
                3D Animations
              </h3>
              <p className="text-glass">
                Immersive weather animations with realistic rain, snow, clouds, and sunshine effects 
                that respond to actual weather conditions.
              </p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3 text-strong-contrast flex items-center gap-2">
                <Zap size={24} className="text-blue-400" />
                AI Insights
              </h3>
              <p className="text-glass">
                Powered by Google Gemini AI to provide intelligent weather analysis, personalized 
                recommendations, and allergy alerts.
              </p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-3 text-strong-contrast flex items-center gap-2">
                <Globe size={24} className="text-green-400" />
                Global Coverage
              </h3>
              <p className="text-glass">
                Search any location worldwide and get accurate, up-to-date weather information 
                with 7-day forecasts and hourly breakdowns.
              </p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🌡️</div>
              <h3 className="text-xl font-bold mb-3 text-strong-contrast">
                Temperature Toggle
              </h3>
              <p className="text-glass">
                Seamlessly switch between Celsius and Fahrenheit with a single click. 
                Your preference is automatically saved.
              </p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-3 text-strong-contrast">
                Save Locations
              </h3>
              <p className="text-glass">
                Save your favorite locations and quickly switch between them. Perfect for travelers 
                and people with multiple homes.
              </p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3 text-strong-contrast flex items-center gap-2">
                <Shield size={24} className="text-purple-400" />
                Privacy First
              </h3>
              <p className="text-glass">
                Your data is stored locally on your device. We respect your privacy and 
                never sell your information.
              </p>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="card fade-in">
            <h2 className="text-3xl font-bold mb-6 text-strong-contrast">
              Powered By Modern Technology
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20">
                <div className="text-3xl mb-2">⚛️</div>
                <p className="font-bold text-strong-contrast">Next.js 14</p>
                <p className="text-xs text-glass">React Framework</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20">
                <div className="text-3xl mb-2">🎨</div>
                <p className="font-bold text-strong-contrast">Tailwind CSS</p>
                <p className="text-xs text-glass">Styling</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20">
                <div className="text-3xl mb-2">🤖</div>
                <p className="font-bold text-strong-contrast">Google Gemini</p>
                <p className="text-xs text-glass">AI Engine</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20">
                <div className="text-3xl mb-2">🌤️</div>
                <p className="font-bold text-strong-contrast">WeatherAPI</p>
                <p className="text-xs text-glass">Data Provider</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="text-4xl font-bold text-strong-contrast mb-2">200+</div>
              <p className="text-glass">Rain Drops</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-strong-contrast mb-2">100+</div>
              <p className="text-glass">Snowflakes</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-strong-contrast mb-2">7 Days</div>
              <p className="text-glass">Forecast</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-strong-contrast mb-2">24 Hours</div>
              <p className="text-glass">Hourly Data</p>
            </div>
          </div>

          {/* Reviews Section */}
          <div id="reviews">
            <h2 className="text-4xl font-bold mb-8 text-center text-strong-contrast">
              Reviews & Feedback
            </h2>
            <Reviews />
          </div>

          {/* Call to Action */}
          <div className="card text-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-400/30">
            <h2 className="text-3xl font-bold mb-4 text-strong-contrast">
              Ready to Experience Weather Differently?
            </h2>
            <p className="text-lg text-glass mb-6">
              Join thousands of users who've made WeatherApp their go-to weather companion.
            </p>
            <Link href="/" className="btn-primary inline-block">
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
