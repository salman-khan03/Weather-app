'use client'

import type { WeatherData } from '@/types'

interface CurrentWeatherProps {
  weather: WeatherData
}

export default function CurrentWeather({ weather }: CurrentWeatherProps) {
  const getWeatherEmoji = (condition: string): string => {
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

  return (
    <div className="card">
      <div className="grid grid-cols-2 items-center">
        <div>
          <p className="text-sm opacity-80 mb-2">Current Weather</p>
          <p className="text-6xl font-bold mb-4">
            {Math.round(weather.current.temp)}°C
          </p>
          <p className="text-2xl mb-2">{weather.current.main}</p>
          <p className="text-lg opacity-80">{weather.current.description}</p>
        </div>
        <div className="text-center">
          <div className="weather-icon">
            {getWeatherEmoji(weather.current.main)}
          </div>
          <p className="text-sm opacity-80 mt-4">
            Feels like {Math.round(weather.current.feels_like)}°C
          </p>
        </div>
      </div>

      {/* Temperature Range */}
      <div className="mt-6 pt-6 border-t border-white border-opacity-20">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-80">High</p>
            <p className="text-3xl font-bold">
              {Math.round(weather.daily[0].temp_max)}°C
            </p>
          </div>
          <div>
            <p className="text-sm opacity-80">Low</p>
            <p className="text-3xl font-bold">
              {Math.round(weather.daily[0].temp_min)}°C
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
