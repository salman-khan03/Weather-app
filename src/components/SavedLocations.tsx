'use client'

import { useState } from 'react'
import { Heart, Plus, Trash2 } from 'lucide-react'
import { useWeatherStore } from '@/store/weatherStore'
import { weatherAPI } from '@/lib/api'

export default function SavedLocations() {
  const {
    savedLocations,
    setSavedLocations,
    removeSavedLocation,
    toggleFavorite,
    setCurrentWeather,
    setIsLoading,
  } = useWeatherStore()

  const [showAddForm, setShowAddForm] = useState(false)
  const [newLocation, setNewLocation] = useState({ name: '', lat: '', lon: '' })

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLocation.name || !newLocation.lat || !newLocation.lon) return

    const location = {
      id: Date.now().toString(),
      name: newLocation.name,
      country: 'User Added',
      lat: parseFloat(newLocation.lat),
      lon: parseFloat(newLocation.lon),
      is_favorite: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setSavedLocations([location, ...savedLocations])
    setNewLocation({ name: '', lat: '', lon: '' })
    setShowAddForm(false)
  }

  const handleLoadLocation = async (location: any) => {
    try {
      setIsLoading(true)
      const weather = await weatherAPI.getWeatherByCoords(location.lat, location.lon)
      setCurrentWeather(weather)
    } catch (error) {
      console.error('Error loading weather:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Saved Locations</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Add Location Form */}
      {showAddForm && (
        <form onSubmit={handleAddLocation} className="mb-4 p-4 rounded-lg bg-white bg-opacity-10 space-y-3">
          <input
            type="text"
            placeholder="Location name"
            value={newLocation.name}
            onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Latitude"
            step="0.0001"
            value={newLocation.lat}
            onChange={(e) => setNewLocation({ ...newLocation, lat: e.target.value })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Longitude"
            step="0.0001"
            value={newLocation.lon}
            onChange={(e) => setNewLocation({ ...newLocation, lon: e.target.value })}
            className="input-field"
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1">
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Locations List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {savedLocations.length === 0 ? (
          <p className="text-sm opacity-60 text-center py-4">No saved locations</p>
        ) : (
          savedLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => handleLoadLocation(location)}
              className="w-full text-left p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all flex items-center justify-between group"
            >
              <div>
                <p className="font-bold">{location.name}</p>
                <p className="text-xs opacity-60">{location.country}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(location.id)
                  }}
                  className="p-1"
                >
                  <Heart
                    size={18}
                    className={location.is_favorite ? 'fill-current' : ''}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeSavedLocation(location.id)
                  }}
                  className="p-1 text-red-400"
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
