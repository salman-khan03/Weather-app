'use client'

import { useEffect, useState } from 'react'
import { weatherAPI } from '@/lib/api'
import { useWeatherStore } from '@/store/weatherStore'
import Header from '@/components/Header'
import CurrentWeather from '@/components/CurrentWeather'
import WeatherDetails from '@/components/WeatherDetails'
import ForecastCard from '@/components/ForecastCard'
import SavedLocations from '@/components/SavedLocations'
import AIInsight from '@/components/AIInsight'
import SearchBar from '@/components/SearchBar'
import type { WeatherData } from '@/types'

export default function Home() {
  const {
    currentWeather,
    selectedLocation,
    setCurrentWeather,
    setIsLoading,
    setError,
    isLoading,
    error,
  } = useWeatherStore()

  useEffect(() => {
    // Get user's location on mount
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const data = await weatherAPI.getWeatherByCoords(latitude, longitude)
            setCurrentWeather(data)
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
  }, [setCurrentWeather, setIsLoading, setError])

  return (
    <main className="min-h-screen bg-gradient-primary">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-500 bg-opacity-20 border border-red-400 text-white">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="spinner text-4xl">⏳</div>
          </div>
        )}

        {/* Main Content */}
        {currentWeather && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Main Weather Display */}
            <div className="lg:col-span-2 space-y-6">
              <CurrentWeather weather={currentWeather} />
              <WeatherDetails weather={currentWeather} />

              {/* Forecast */}
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {currentWeather.daily?.slice(0, 5).map((day, index) => (
                    <ForecastCard key={index} day={day} />
                  ))}
                </div>
              </div>

              {/* Hourly Forecast */}
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Next 24 Hours</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto">
                  {currentWeather.hourly?.slice(0, 12).map((hour, index) => (
                    <div key={index} className="text-center p-3 rounded-lg bg-white bg-opacity-10">
                      <p className="text-sm opacity-80 mb-2">
                        {new Date(hour.dt * 1000).getHours()}:00
                      </p>
                      <p className="text-3xl mb-2">
                        {getWeatherEmoji(hour.main)}
                      </p>
                      <p className="font-bold">{Math.round(hour.temp)}°</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <AIInsight location={selectedLocation} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <SavedLocations />

              {/* Alerts */}
              {currentWeather.alerts && currentWeather.alerts.length > 0 && (
                <div className="card border-red-400">
                  <h3 className="text-xl font-bold mb-3 text-red-300">
                    ⚠️ Weather Alerts
                  </h3>
                  <div className="space-y-2">
                    {currentWeather.alerts.map((alert, index) => (
                      <div key={index} className="text-sm opacity-90">
                        <p className="font-bold">{alert.event}</p>
                        <p>{alert.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="card">
                <h3 className="text-xl font-bold mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Feels Like</span>
                    <span className="font-bold">
                      {Math.round(currentWeather.current.feels_like)}°C
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Humidity</span>
                    <span className="font-bold">
                      {currentWeather.current.humidity}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pressure</span>
                    <span className="font-bold">
                      {currentWeather.current.pressure} mb
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visibility</span>
                    <span className="font-bold">
                      {(currentWeather.current.visibility / 1000).toFixed(1)} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>UV Index</span>
                    <span className="font-bold">{currentWeather.current.uvi}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function getWeatherEmoji(condition: string): string {
  const conditions: { [key: string]: string } = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Smoke: '💨',
    Haze: '🌫️',
    Dust: '💨',
    Fog: '🌫️',
    Sand: '💨',
    Ash: '💨',
    Squall: '🌪️',
    Tornado: '🌪️',
  }
  return conditions[condition] || '🌤️'
}
