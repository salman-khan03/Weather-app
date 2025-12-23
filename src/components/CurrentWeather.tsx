'use client'

import { useWeatherStore } from '@/store/weatherStore'
import { getTemperature } from '@/lib/temperature'
import type { WeatherData } from '@/types'

interface CurrentWeatherProps {
  weather: WeatherData
}

export default function CurrentWeather({ weather }: CurrentWeatherProps) {
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

  const getIconAnimationClass = (condition: string): string => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) return 'icon-sunny'
    if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) return 'icon-cloudy'
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return 'icon-rainy'
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return 'icon-thunder'
    if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) return 'icon-snowy'
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return 'icon-foggy'
    if (conditionLower.includes('wind')) return 'icon-windy'
    return 'icon-cloudy'
  }

  const todayForecast = weather.forecast.forecastday[0]

  return (
    <div className="card fade-in relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl -ml-32 -mb-32"></div>
      
      <div className="relative z-10">
        {/* Current Weather Label */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest font-bold text-strong-contrast">Current Weather</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Temperature & Location */}
          <div className="space-y-4">
            {/* Temperature Display */}
            <div className="flex items-baseline gap-3">
              <p className="text-8xl md:text-9xl font-bold tracking-tight text-strong-contrast" style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6)) drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
              }}>
                {getTemperature(weather.current.temp_c, temperatureUnit).split('°')[0]}
              </p>
              <p className="text-5xl font-light text-strong-contrast">°{temperatureUnit}</p>
            </div>
            
            {/* Condition */}
            <p className="text-3xl font-semibold text-strong-contrast leading-tight">{weather.current.condition.text}</p>
            
            {/* Location */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <p className="text-xl text-strong-contrast font-medium">{weather.location.name}, {weather.location.country}</p>
            </div>
            
            {/* Feels Like - No Box */}
            <p className="text-base font-bold text-strong-contrast">
              Feels like {getTemperature(weather.current.feelslike_c, temperatureUnit)}
            </p>
          </div>

          {/* Right Side - Weather Icon & High/Low */}
          <div className="flex flex-col items-center md:items-end gap-6">
            {/* Large Weather Icon */}
            <div 
              className={`${getIconAnimationClass(weather.current.condition.text)}`}
              style={{ fontSize: '160px', lineHeight: 1 }}
            >
              {getWeatherEmoji(weather.current.condition.text)}
            </div>
            
            {/* High/Low Temperature Badge */}
            <div className="inline-flex items-center gap-6 bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-xl rounded-full px-8 py-4 border border-white border-opacity-30 shadow-xl">
              <div className="text-center">
                <p className="text-xs font-bold text-strong-contrast mb-1 uppercase tracking-wider">High</p>
                <p className="text-3xl font-bold text-orange-300" style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
                  filter: 'drop-shadow(0 0 10px rgba(251, 146, 60, 0.5))'
                }}>
                  {getTemperature(todayForecast.day.maxtemp_c, temperatureUnit)}
                </p>
              </div>
              <div className="h-12 w-px bg-white opacity-40"></div>
              <div className="text-center">
                <p className="text-xs font-bold text-strong-contrast mb-1 uppercase tracking-wider">Low</p>
                <p className="text-3xl font-bold text-blue-300" style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
                  filter: 'drop-shadow(0 0 10px rgba(147, 197, 253, 0.5))'
                }}>
                  {getTemperature(todayForecast.day.mintemp_c, temperatureUnit)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-10 pt-8 border-t border-white border-opacity-25">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-15 transition-all">
              <div className="text-3xl mb-2">💨</div>
              <p className="text-xs uppercase tracking-wider font-bold text-strong-contrast mb-1.5 opacity-80">Wind</p>
              <p className="text-xl font-bold text-strong-contrast">{Math.round(weather.current.wind_kph)} km/h</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-15 transition-all">
              <div className="text-3xl mb-2">💧</div>
              <p className="text-xs uppercase tracking-wider font-bold text-strong-contrast mb-1.5 opacity-80">Humidity</p>
              <p className="text-xl font-bold text-strong-contrast">{weather.current.humidity}%</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-15 transition-all">
              <div className="text-3xl mb-2">👁️</div>
              <p className="text-xs uppercase tracking-wider font-bold text-strong-contrast mb-1.5 opacity-80">Visibility</p>
              <p className="text-xl font-bold text-strong-contrast">{weather.current.vis_km} km</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-15 transition-all">
              <div className="text-3xl mb-2">🌡️</div>
              <p className="text-xs uppercase tracking-wider font-bold text-strong-contrast mb-1.5 opacity-80">Pressure</p>
              <p className="text-xl font-bold text-strong-contrast">{weather.current.pressure_mb} mb</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
