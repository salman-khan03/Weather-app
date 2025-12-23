'use client'

import { useEffect } from 'react'
import { weatherAPI } from '@/lib/api'
import { useWeatherStore } from '@/store/weatherStore'
import { getTemperature } from '@/lib/temperature'
import Header from '@/components/Header'
import CurrentWeather from '@/components/CurrentWeather'
import WeatherDetails from '@/components/WeatherDetails'
import ForecastCard from '@/components/ForecastCard'
import SavedLocations from '@/components/SavedLocations'
import AIInsight from '@/components/AIInsight'
import SearchBar from '@/components/SearchBar'
import Testimonials from '@/components/Testimonials'

export default function Home() {
  const {
    currentWeather,
    selectedLocation,
    setCurrentWeather,
    setIsLoading,
    setError,
    isLoading,
    error,
    temperatureUnit,
  } = useWeatherStore()

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

  const getHourlyAnimationClass = (condition: string): string => {
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

  useEffect(() => {
    // Get user's location on mount
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const data = await weatherAPI.getWeatherByCoords(latitude, longitude)
            setCurrentWeather(data)
          } catch (err) {
            setError('Failed to fetch weather data')
            console.error(err)
          } finally {
            setIsLoading(false)
          }
        },
        (error) => {
          setError('Failed to get your location')
          setIsLoading(false)
          console.error(error)
        }
      )
    }
  }, [setCurrentWeather, setIsLoading, setError])

  return (
    <main className="min-h-screen relative">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-500 bg-opacity-20 border border-red-400 text-white">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="spinner text-4xl">⏳</div>
          </div>
        )}

        {/* Main Content */}
        {currentWeather && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Main Weather Display */}
            <div className="lg:col-span-2 space-y-6">
              <CurrentWeather weather={currentWeather} />
              <WeatherDetails weather={currentWeather} />

              {/* Forecast */}
              <div className="card fade-in">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-strong-contrast">
                  <span className="text-4xl">📅</span>
                  7-Day Forecast
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                  {currentWeather.forecast.forecastday.map((day, index) => (
                    <ForecastCard key={index} day={day} index={index} />
                  ))}
                </div>
              </div>

              {/* Hourly Forecast */}
              <div className="card fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-strong-contrast">
                  <span className="text-3xl">🕐</span>
                  Next 24 Hours
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {currentWeather.forecast.forecastday[0].hour.slice(0, 24).map((hour, index) => (
                    <div 
                      key={index} 
                      className="forecast-card-animated text-center p-4 rounded-2xl bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-md border border-white border-opacity-20 cursor-pointer transition-all duration-300"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <p className="text-sm opacity-80 mb-3 font-medium text-strong-contrast">
                        {new Date(hour.time).getHours()}:00
                      </p>
                      <div className={`weather-icon-animated text-5xl mb-3 ${getHourlyAnimationClass(hour.condition.text)}`}>
                        {getWeatherEmoji(hour.condition.text)}
                      </div>
                      <p className="font-bold text-lg text-strong-contrast forecast-temp">{getTemperature(hour.temp_c, temperatureUnit)}</p>
                      <p className="text-xs opacity-80 mt-1 text-glass forecast-condition">{hour.condition.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <AIInsight location={selectedLocation} />

              {/* Testimonials */}
              <Testimonials />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <SavedLocations />

              {/* Alerts */}
              {currentWeather.alerts && currentWeather.alerts.alert && currentWeather.alerts.alert.length > 0 && (
                <div className="card border-red-400">
                  <h3 className="text-xl font-bold mb-3 text-red-300">
                    ⚠️ Weather Alerts
                  </h3>
                  <div className="space-y-2">
                    {currentWeather.alerts.alert.map((alert, index) => (
                      <div key={index} className="text-sm opacity-90">
                        <p className="font-bold">{alert.event}</p>
                        <p>{alert.headline}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="card">
                <h3 className="text-xl font-bold mb-3 text-strong-contrast">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-glass font-medium">Feels Like</span>
                    <span className="font-bold text-strong-contrast">
                      {getTemperature(currentWeather.current.feelslike_c, temperatureUnit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-glass font-medium">Humidity</span>
                    <span className="font-bold text-strong-contrast">
                      {currentWeather.current.humidity}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-glass font-medium">Pressure</span>
                    <span className="font-bold text-strong-contrast">
                      {currentWeather.current.pressure_mb} mb
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-glass font-medium">Visibility</span>
                    <span className="font-bold text-strong-contrast">
                      {currentWeather.current.vis_km} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-glass font-medium">UV Index</span>
                    <span className="font-bold text-strong-contrast">{currentWeather.current.uv}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
