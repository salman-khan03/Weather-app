'use client'

import type { Weather } from '@/types'

interface ForecastCardProps {
  day: Weather
}

export default function ForecastCard({ day }: ForecastCardProps) {
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

  const date = new Date(day.dt * 1000)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })

  return (
    <div className="p-4 rounded-lg bg-white bg-opacity-10 backdrop-blur text-center hover:bg-opacity-20 transition-all cursor-pointer">
      <p className="text-sm opacity-80 mb-2">{dayName}</p>
      <p className="text-3xl mb-2">{getWeatherEmoji(day.main)}</p>
      <p className="text-xs opacity-80 mb-2">{day.main}</p>
      <div className="flex justify-around text-sm font-bold">
        <span>{Math.round(day.temp_max)}°</span>
        <span className="opacity-60">{Math.round(day.temp_min)}°</span>
      </div>
    </div>
  )
}
