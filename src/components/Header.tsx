'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Cloud, User, LogOut, Menu, X, Thermometer, Settings } from 'lucide-react'
import { useWeatherStore } from '@/store/weatherStore'
import { useAuth } from '@/contexts/AuthContext'
import { weatherAPI } from '@/lib/api'
import { haptics } from '@/lib/haptics'

export default function Header() {
  const router = useRouter()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { setCurrentWeather, setIsLoading, setError, clearSearch, temperatureUnit, toggleTemperatureUnit } = useWeatherStore()
  
  // Safely get auth context - will be null until mounted
  let user = null
  let signOut = async () => {}
  let isAuthenticated = false
  
  try {
    const auth = useAuth()
    user = auth.user
    signOut = auth.signOut
    isAuthenticated = auth.isAuthenticated
  } catch (e) {
    // Auth not available yet
  }

  useEffect(() => {
    setMounted(true)
    
    // Load temperature unit preference
    const savedUnit = localStorage.getItem('temperatureUnit') as 'C' | 'F' | null
    if (savedUnit) {
      useWeatherStore.getState().setTemperatureUnit(savedUnit)
    }
  }, [])

  const handleLogout = async () => {
    if (!mounted) return
    
    haptics.tap()
    try {
      await signOut()
      haptics.success()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
      haptics.error()
    }
  }

  const handleToggleTemp = () => {
    haptics.toggle()
    toggleTemperatureUnit()
  }
  
  // Don't render auth-dependent UI until mounted
  if (!mounted) {
    return (
      <header className="glass sticky top-0 z-50 border-b border-white border-opacity-20 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud size={32} className="text-white" />
              <h1 className="text-2xl md:text-3xl font-bold text-white text-strong-contrast">WeatherApp</h1>
            </div>
          </div>
        </div>
      </header>
    )
  }

  const handleHomeClick = async () => {
    haptics.tap()
    
    // Clear search bar
    clearSearch()
    
    // Get user's current location
    if (navigator.geolocation) {
      setIsLoading(true)
      setError(null)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const data = await weatherAPI.getWeatherByCoords(latitude, longitude)
            setCurrentWeather(data)
            haptics.success()
            router.push('/')
          } catch (err) {
            setError('Failed to fetch weather data')
            console.error(err)
          } finally {
            setIsLoading(false)
          }
        },
        (error) => {
          setError('Failed to get your location')
          setIsLoading(false)
          console.error(error)
        }
      )
    }
  }

  const handleLogoClick = () => {
    // Clear search bar when clicking logo
    clearSearch()
  }

  return (
    <header className="glass sticky top-0 z-50 border-b border-white border-opacity-20 shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={handleHomeClick}
              className="text-white hover:text-opacity-80 transition-all font-bold text-strong-contrast"
            >
              Home
            </button>
            <Link href="/about" className="text-white hover:text-opacity-80 transition-all font-bold text-strong-contrast">
              About
            </Link>
            
            {user && (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/30 to-purple-500/30 hover:from-blue-500/40 hover:to-purple-500/40 border border-white border-opacity-30 transition-all text-white text-sm font-bold text-strong-contrast"
                >
                  <Settings size={16} />
                  <span>Profile</span>
                </Link>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30">
                  <User size={16} />
                  <span className="text-white text-sm font-bold text-strong-contrast">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 bg-opacity-30 hover:bg-opacity-40 transition-all text-white text-sm font-bold text-strong-contrast border border-red-400 border-opacity-30"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>

          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2">
              <Cloud size={32} className="text-white" style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
              }} />
              <h1 className="text-2xl md:text-3xl font-bold text-white text-strong-contrast">WeatherApp</h1>
            </Link>
          </div>

          {/* Right Side - Temperature Toggle & Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Temperature Unit Toggle */}
            <button
              onClick={toggleTemperatureUnit}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500/30 to-purple-500/30 hover:from-blue-500/40 hover:to-purple-500/40 transition-all text-white border border-white border-opacity-30 shadow-lg backdrop-blur-sm"
              title="Toggle temperature unit"
            >
              <Thermometer size={18} style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))'
              }} />
              <span className="font-bold text-strong-contrast text-lg">°{temperatureUnit}</span>
            </button>
            
            {!user && (
              <>
                <Link href="/signin" className="text-white hover:text-opacity-80 transition-all font-bold text-strong-contrast">
                  Sign In
                </Link>
                <Link href="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-white p-2 ml-auto"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 py-4 border-t border-white border-opacity-20">
            <nav className="flex flex-col gap-4">
              {/* Temperature Unit Toggle - Mobile */}
              <button
                onClick={toggleTemperatureUnit}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all text-white border border-white border-opacity-20"
              >
                <Thermometer size={18} />
                <span>Temperature: <span className="font-bold">°{temperatureUnit}</span></span>
              </button>
              
              <button
                onClick={() => {
                  handleHomeClick()
                  setShowMobileMenu(false)
                }}
                className="text-white hover:text-opacity-80 transition-all py-2 text-left"
              >
                Home
              </button>
              <Link
                href="/about"
                onClick={() => setShowMobileMenu(false)}
                className="text-white hover:text-opacity-80 transition-all py-2"
              >
                About
              </Link>
              
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/30 to-purple-500/30 hover:from-blue-500/40 hover:to-purple-500/40 transition-all text-white"
                  >
                    <Settings size={18} />
                    <span>Profile Settings</span>
                  </Link>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white bg-opacity-10">
                    <User size={18} />
                    <span className="text-white">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setShowMobileMenu(false)
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 bg-opacity-20 hover:bg-opacity-30 transition-all text-white"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setShowMobileMenu(false)}
                    className="text-white hover:text-opacity-80 transition-all py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setShowMobileMenu(false)}
                    className="btn-primary inline-block text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
