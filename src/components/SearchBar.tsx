'use client'

import { useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { weatherAPI } from '@/lib/api'
import { useWeatherStore } from '@/store/weatherStore'
import { db, isSupabaseConfigured } from '@/lib/supabase'
import { getUserId } from '@/lib/userManager'
import { useState } from 'react'

export default function SearchBar() {
  const { searchQuery, setSearchQuery, setCurrentWeather, setIsLoading: setStoreLoading } = useWeatherStore()
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (value.length < 2) {
      setSuggestions([])
      return
    }

    try {
      setIsLoading(true)
      const results = await weatherAPI.searchLocations(value)
      setSuggestions(results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveWeatherHistory = async (weather: any, city: any) => {
    if (!isSupabaseConfigured) {
      console.log('⚠️ Supabase not configured, skipping history save')
      return
    }

    try {
      const userId = getUserId()
      console.log('📜 Saving weather search to history for user:', userId)

      const historyEntry = {
        user_id: userId,
        location_name: city.name,
        lat: city.lat,
        lon: city.lon,
        temperature: weather.current.temp_c,
        condition: weather.current.condition.text,
        humidity: weather.current.humidity,
        wind_speed: weather.current.wind_kph,
        searched_at: new Date().toISOString(),
      }

      await db.weatherHistory.create(historyEntry)
      console.log('✅ Weather history saved to Supabase')
    } catch (error) {
      console.error('⚠️ Failed to save weather history:', error)
    }
  }

  const handleSelectLocation = async (city: any) => {
    try {
      setStoreLoading(true)
      const weather = await weatherAPI.getWeatherByCoords(city.lat, city.lon)
      setCurrentWeather(weather)
      setSearchQuery(`${city.name}, ${city.country}`)
      setSuggestions([])

      // Save to weather history in Supabase
      saveWeatherHistory(weather, city)
    } catch (error) {
      console.error('Error fetching weather:', error)
    } finally {
      setStoreLoading(false)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSuggestions([])
  }

  return (
    <div className="relative">
      <div className="card flex items-center gap-3 p-4">
        <Search size={24} className="opacity-80" />
        <input
          type="text"
          placeholder="Search for a city or location..."
          value={searchQuery}
          onChange={handleSearch}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-300"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-10 transition-all"
            title="Clear search"
          >
            <X size={20} className="opacity-60 hover:opacity-100" />
          </button>
        )}
        {isLoading && <span className="text-sm opacity-60">Searching...</span>}
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 card max-h-80 overflow-y-auto z-50">
          <div className="space-y-2">
            {suggestions.map((city, index) => (
              <button
                key={index}
                onClick={() => handleSelectLocation(city)}
                className="w-full text-left p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all text-white"
              >
                <p className="font-bold">{city.name}</p>
                <p className="text-sm opacity-80">
                  {city.region && `${city.region}, `}{city.country}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
