'use client'

import { useWeatherStore } from '@/store/weatherStore'
import { getTemperature } from '@/lib/temperature'
import type { ForecastDay } from '@/types'

interface ForecastCardProps {
  day: ForecastDay
  index?: number
}

export default function ForecastCard({ day, index = 0 }: ForecastCardProps) {
  const { temperatureUnit } = useWeatherStore()
  
  const getWeatherEmoji = (condition: string): string => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) return '☀️'
    if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) return '☁️'
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '🌧️'
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return '⛈️'
    if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) return '❄️'
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️'
    if (conditionLower.includes('sleet')) return '🌨️'
    return '🌤️'
  }

  const getAnimationClass = (condition: string): string => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) return 'forecast-sunny'
    if (conditionLower.includes('partly')) return 'forecast-partly-cloudy'
    if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) return 'forecast-cloudy'
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return 'forecast-rainy'
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return 'forecast-thunder'
    if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) return 'forecast-snowy'
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return 'forecast-foggy'
    if (conditionLower.includes('wind')) return 'forecast-windy'
    return 'forecast-sunny'
  }

  const date = new Date(day.date)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div 
      className="forecast-card-animated p-5 rounded-3xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl text-center hover:from-white/30 hover:to-white/15 transition-all cursor-pointer border border-white/30 shadow-xl fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <p className="text-sm font-bold text-strong-contrast mb-1">{dayName}</p>
      <p className="text-xs text-glass mb-4 font-semibold">{monthDay}</p>
      
      <div className={`weather-icon-animated text-6xl mb-4 inline-block ${getAnimationClass(day.day.condition.text)}`}>
        {getWeatherEmoji(day.day.condition.text)}
      </div>
      
      <p className="text-xs text-glass mb-4 h-8 flex items-center justify-center px-2 font-semibold forecast-condition">
        {day.day.condition.text}
      </p>
      
      <div className="flex justify-center items-center gap-3 text-base font-bold forecast-temp">
        <div className="flex flex-col items-center">
          <span className="text-xs text-glass mb-1 font-bold uppercase tracking-wider">High</span>
          <span className="text-lg text-strong-contrast">{getTemperature(day.day.maxtemp_c, temperatureUnit)}</span>
        </div>
        <div className="h-8 w-px bg-white opacity-40"></div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-glass mb-1 font-bold uppercase tracking-wider">Low</span>
          <span className="text-lg text-strong-contrast">{getTemperature(day.day.mintemp_c, temperatureUnit)}</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-white border-opacity-20">
        <div className="flex justify-around text-xs">
          <div className="flex flex-col items-center">
            <span className="text-lg mb-1">💧</span>
            <span className="font-bold text-strong-contrast">{day.day.daily_chance_of_rain}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg mb-1">💨</span>
            <span className="font-bold text-strong-contrast">{Math.round(day.day.maxwind_kph)} km/h</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg mb-1">☀️</span>
            <span className="font-bold text-strong-contrast">UV {day.day.uv}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
