import { create } from 'zustand'
import type { WeatherData, SavedLocation, AIInsight } from '@/types'

interface WeatherStore {
  currentWeather: WeatherData | null
  selectedLocation: SavedLocation | null
  savedLocations: SavedLocation[]
  isLoading: boolean
  error: string | null
  aiInsight: AIInsight | null
  searchQuery: string
  temperatureUnit: 'C' | 'F'

  // Weather actions
  setCurrentWeather: (data: WeatherData) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Location actions
  setSelectedLocation: (location: SavedLocation | null) => void
  setSavedLocations: (locations: SavedLocation[]) => void
  addSavedLocation: (location: SavedLocation) => void
  removeSavedLocation: (id: string) => void
  updateSavedLocation: (id: string, updates: Partial<SavedLocation>) => void
  toggleFavorite: (id: string) => void

  // AI actions
  setAIInsight: (insight: AIInsight | null) => void

  // Search actions
  setSearchQuery: (query: string) => void
  clearSearch: () => void

  // Temperature unit actions
  setTemperatureUnit: (unit: 'C' | 'F') => void
  toggleTemperatureUnit: () => void

  // Reset
  reset: () => void
}

const initialState = {
  currentWeather: null,
  selectedLocation: null,
  savedLocations: [],
  isLoading: false,
  error: null,
  aiInsight: null,
  searchQuery: '',
  temperatureUnit: 'C' as 'C' | 'F',
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  ...initialState,

  setCurrentWeather: (data: WeatherData) => set({ currentWeather: data }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),

  setSelectedLocation: (location: SavedLocation | null) =>
    set({ selectedLocation: location }),

  setSavedLocations: (locations: SavedLocation[]) =>
    set({ savedLocations: locations }),

  addSavedLocation: (location: SavedLocation) =>
    set((state) => ({
      savedLocations: [location, ...state.savedLocations],
    })),

  removeSavedLocation: (id: string) =>
    set((state) => ({
      savedLocations: state.savedLocations.filter((loc) => loc.id !== id),
    })),

  updateSavedLocation: (id: string, updates: Partial<SavedLocation>) =>
    set((state) => ({
      savedLocations: state.savedLocations.map((loc) =>
        loc.id === id ? { ...loc, ...updates } : loc
      ),
    })),

  toggleFavorite: (id: string) => {
    const state = get()
    const location = state.savedLocations.find((loc) => loc.id === id)
    if (location) {
      set((state) => ({
        savedLocations: state.savedLocations.map((loc) =>
          loc.id === id ? { ...loc, is_favorite: !loc.is_favorite } : loc
        ),
      }))
    }
  },

  setAIInsight: (insight: AIInsight | null) => set({ aiInsight: insight }),

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: '' }),

  setTemperatureUnit: (unit: 'C' | 'F') => {
    set({ temperatureUnit: unit })
    localStorage.setItem('temperatureUnit', unit)
  },
  
  toggleTemperatureUnit: () => {
    const state = get()
    const newUnit = state.temperatureUnit === 'C' ? 'F' : 'C'
    set({ temperatureUnit: newUnit })
    localStorage.setItem('temperatureUnit', newUnit)
  },

  reset: () => set(initialState),
}))
