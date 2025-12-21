export interface Weather {
  id: number
  main: string
  description: string
  icon: string
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  humidity: number
  pressure: number
  wind_speed: number
  wind_deg: number
  clouds: number
  visibility: number
  uvi: number
  rain?: number
  snow?: number
}

export interface Location {
  id: string
  name: string
  country: string
  lat: number
  lon: number
  timezone: string
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface WeatherData {
  lat: number
  lon: number
  timezone: string
  current: Weather
  hourly: Weather[]
  daily: Weather[]
  alerts?: Array<{
    sender_name: string
    event: string
    start: number
    end: number
    description: string
  }>
}

export interface SavedLocation {
  id: string
  userId: string
  name: string
  country: string
  lat: number
  lon: number
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface WeatherHistory {
  id: string
  userId: string
  locationId: string
  temperature: number
  condition: string
  timestamp: string
  created_at: string
}

export interface AIInsight {
  id: string
  userId: string
  locationId: string
  insight: string
  suggestions: string[]
  created_at: string
}
