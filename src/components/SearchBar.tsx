'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { weatherAPI } from '@/lib/api'
import { useWeatherStore } from '@/store/weatherStore'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { setCurrentWeather, setIsLoading: setStoreLoading } = useWeatherStore()

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.length < 2) {
      setSuggestions([])
      return
    }

    try {
      setIsLoading(true)
      const results = await weatherAPI.searchCities(value)
      setSuggestions(results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectLocation = async (city: any) => {
    try {
      setStoreLoading(true)
      const weather = await weatherAPI.getWeatherByCoords(city.lat, city.lon)
      setCurrentWeather(weather)
      setQuery(`${city.name}, ${city.country}`)
      setSuggestions([])
    } catch (error) {
      console.error('Error fetching weather:', error)
    } finally {
      setStoreLoading(false)
    }
  }

  return (
    <div className="relative">
      <div className="card flex items-center gap-3 p-4">
        <Search size={24} className="opacity-80" />
        <input
          type="text"
          placeholder="Search for a city or location..."
          value={query}
          onChange={handleSearch}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-300"
        />
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 card max-h-80 overflow-y-auto">
          <div className="space-y-2">
            {suggestions.map((city, index) => (
              <button
                key={index}
                onClick={() => handleSelectLocation(city)}
                className="w-full text-left p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all text-white"
              >
                <p className="font-bold">{city.name}</p>
                <p className="text-sm opacity-80">
                  {city.country}
                  {city.state ? `, ${city.state}` : ''}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
