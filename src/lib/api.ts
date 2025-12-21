import axios from 'axios'
import type { WeatherData } from '@/types'

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall'

export const weatherAPI = {
  getWeatherByCoords: async (lat: number, lon: number): Promise<WeatherData> => {
    try {
      const response = await axios.get(`${OPENWEATHER_BASE_URL}`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
          exclude: 'minutely',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching weather data:', error)
      throw error
    }
  },

  searchCities: async (query: string) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct`,
        {
          params: {
            q: query,
            limit: 5,
            appid: OPENWEATHER_API_KEY,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error searching cities:', error)
      throw error
    }
  },

  reverseGeocode: async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse`,
        {
          params: {
            lat,
            lon,
            limit: 1,
            appid: OPENWEATHER_API_KEY,
          },
        }
      )
      return response.data[0]
    } catch (error) {
      console.error('Error reverse geocoding:', error)
      throw error
    }
  },
}
