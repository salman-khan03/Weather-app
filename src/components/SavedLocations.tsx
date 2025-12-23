'use client'

import { useState, useEffect } from 'react'
import { Heart, MapPin, Trash2, Star } from 'lucide-react'
import { useWeatherStore } from '@/store/weatherStore'
import { getTemperature } from '@/lib/temperature'
import { weatherAPI } from '@/lib/api'
import { db } from '@/lib/supabase'
import { getUserId, getUser } from '@/lib/userManager'

export default function SavedLocations() {
  const {
    currentWeather,
    savedLocations,
    setSavedLocations,
    removeSavedLocation,
    toggleFavorite,
    setCurrentWeather,
    setIsLoading,
    temperatureUnit,
  } = useWeatherStore()

  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadSavedLocations()
  }, [])

  const loadSavedLocations = async () => {
    try {
      const userId = getUserId()
      console.log('🔑 Loading locations for user ID:', userId)
      
      // Try to load from database first
      try {
        const locations = await db.locations.getAll(userId)
        console.log('📍 Loaded locations from Supabase:', locations)
        if (locations && locations.length > 0) {
          setSavedLocations(locations)
          // Sync to localStorage as backup
          localStorage.setItem('savedLocations', JSON.stringify(locations))
          return
        }
      } catch (dbError) {
        console.warn('⚠️ Could not load from Supabase, trying localStorage:', dbError)
      }
      
      // Fallback to localStorage
      const localLocations = localStorage.getItem('savedLocations')
      if (localLocations) {
        const parsed = JSON.parse(localLocations)
        console.log('💾 Loaded locations from localStorage:', parsed)
        setSavedLocations(parsed)
      }
    } catch (error) {
      console.error('❌ Error loading saved locations:', error)
    }
  }

  const handleSaveCurrentLocation = async () => {
    if (!currentWeather) {
      setMessage({ type: 'error', text: 'No location to save' })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      const userId = getUserId()
      const user = getUser()
      
      console.log('💾 Saving location with user ID:', userId)

      const locationToSave = {
        user_id: userId, // Use proper UUID
        name: currentWeather.location.name,
        region: currentWeather.location.region || null,
        country: currentWeather.location.country,
        lat: currentWeather.location.lat,
        lon: currentWeather.location.lon,
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Check if location already saved
      const alreadySaved = savedLocations.some(
        loc => loc.lat === locationToSave.lat && loc.lon === locationToSave.lon
      )

      if (alreadySaved) {
        setMessage({ type: 'error', text: 'Location already saved!' })
        setIsSaving(false)
        return
      }

      // Try to save to database
      let savedLocation = null
      try {
        savedLocation = await db.locations.create(locationToSave)
        console.log('✅ Location saved to Supabase:', savedLocation)
      } catch (dbError) {
        console.error('⚠️ Database save failed, saving locally only:', dbError)
        savedLocation = { ...locationToSave, id: Date.now().toString() }
      }

      // Update local state
      const updatedLocations = [savedLocation, ...savedLocations]
      setSavedLocations(updatedLocations)
      
      // Also save to localStorage as backup
      localStorage.setItem('savedLocations', JSON.stringify(updatedLocations))

      setMessage({ type: 'success', text: `${currentWeather.location.name} saved!` })
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('❌ Error saving location:', error)
      setMessage({ type: 'error', text: 'Failed to save location' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoadLocation = async (location: any) => {
    try {
      setIsLoading(true)
      const weather = await weatherAPI.getWeatherByCoords(location.lat, location.lon)
      setCurrentWeather(weather)

      // Save to weather history
      try {
        const userId = getUserId()
        console.log('📜 Saving weather history for user:', userId)
        
        const historyEntry = {
          user_id: userId,
          location_name: location.name,
          lat: location.lat,
          lon: location.lon,
          temperature: weather.current.temp_c,
          condition: weather.current.condition.text,
          humidity: weather.current.humidity,
          wind_speed: weather.current.wind_kph,
          searched_at: new Date().toISOString(),
        }
        
        await db.weatherHistory.create(historyEntry)
        console.log('✅ Weather history saved to Supabase')
      } catch (historyError) {
        console.error('⚠️ Failed to save to history:', historyError)
      }
    } catch (error) {
      console.error('❌ Error loading weather:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLocation = async (locationId: string) => {
    try {
      // Try to delete from database
      try {
        await db.locations.delete(locationId)
      } catch (dbError) {
        console.log('Database delete failed', dbError)
      }

      // Remove from local state
      const updatedLocations = savedLocations.filter(loc => loc.id !== locationId)
      setSavedLocations(updatedLocations)
      localStorage.setItem('savedLocations', JSON.stringify(updatedLocations))
      
      setMessage({ type: 'success', text: 'Location removed' })
      setTimeout(() => setMessage(null), 2000)
    } catch (error) {
      console.error('Error deleting location:', error)
    }
  }

  const handleToggleFavorite = async (locationId: string) => {
    const location = savedLocations.find(loc => loc.id === locationId)
    if (!location) return

    try {
      // Try to update in database
      try {
        await db.locations.toggleFavorite(locationId, location.is_favorite)
      } catch (dbError) {
        console.log('Database update failed', dbError)
      }

      // Update local state
      toggleFavorite(locationId)
      
      // Update localStorage
      const updatedLocations = savedLocations.map(loc =>
        loc.id === locationId ? { ...loc, is_favorite: !loc.is_favorite } : loc
      )
      localStorage.setItem('savedLocations', JSON.stringify(updatedLocations))
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Saved Locations</h3>
        <button
          onClick={handleSaveCurrentLocation}
          disabled={isSaving || !currentWeather}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 bg-opacity-20 hover:bg-opacity-30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <MapPin size={16} />
          <span>{isSaving ? 'Saving...' : 'Save Current'}</span>
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-3 p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-500 bg-opacity-20 border border-green-400 text-green-300'
            : 'bg-red-500 bg-opacity-20 border border-red-400 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Current Location Info */}
      {currentWeather && (
        <div className="mb-4 p-3 rounded-lg bg-blue-500 bg-opacity-10 border border-blue-400 border-opacity-30">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={14} className="text-blue-300" />
            <span className="text-xs opacity-70">Current Location</span>
          </div>
          <p className="font-bold">{currentWeather.location.name}</p>
          <p className="text-xs opacity-70">
            {currentWeather.location.region && `${currentWeather.location.region}, `}
            {currentWeather.location.country}
          </p>
          <p className="text-sm mt-1 opacity-80">
            {getTemperature(currentWeather.current.temp_c, temperatureUnit)} • {currentWeather.current.condition.text}
          </p>
        </div>
      )}

      {/* Locations List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {savedLocations.length === 0 ? (
          <p className="text-sm opacity-60 text-center py-8">
            No saved locations yet.<br />
            <span className="text-xs">Search for a city and click "Save Current" to add it</span>
          </p>
        ) : (
          savedLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => handleLoadLocation(location)}
              className="w-full text-left p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all flex items-center justify-between group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {location.is_favorite && (
                    <Star size={14} className="text-yellow-400 fill-current" />
                  )}
                  <p className="font-bold">{location.name}</p>
                </div>
                <p className="text-xs opacity-60">
                  {location.region && `${location.region}, `}{location.country}
                </p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleFavorite(location.id)
                  }}
                  className="p-1"
                  title={location.is_favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    size={18}
                    className={location.is_favorite ? 'fill-current text-red-400' : 'text-white'}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteLocation(location.id)
                  }}
                  className="p-1 text-red-400"
                  title="Delete location"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
