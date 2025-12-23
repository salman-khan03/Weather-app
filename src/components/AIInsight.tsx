'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Loader, RefreshCw, ThermometerSun, Wind, Droplets, CloudRain, AlertTriangle } from 'lucide-react'
import { useWeatherStore } from '@/store/weatherStore'
import { getTemperature } from '@/lib/temperature'
import { getUserId } from '@/lib/userManager'

interface AIInsightProps {
  location: any
}

export default function AIInsight({ location }: AIInsightProps) {
  const { currentWeather, aiInsight, setAIInsight, temperatureUnit } = useWeatherStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Auto-generate insight when weather changes
    if (currentWeather && !aiInsight) {
      generateInsight()
    }
  }, [currentWeather])

  const generateInsight = async () => {
    if (!currentWeather) return

    try {
      setIsLoading(true)
      setError(null)

      // Get location name from weather data
      const locationName = currentWeather.location?.name || location?.name || 'Current Location'
      const userId = getUserId()
      
      console.log('🤖 Generating AI insight for user:', userId)

      const response = await fetch('/api/weather/insight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weatherData: currentWeather,
          location: locationName,
          userId: userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate insight')
      }

      const data = await response.json()
      if (data.success && data.data) {
        setAIInsight(data.data)
        console.log('✅ AI insight generated successfully')
      }
    } catch (err) {
      setError('Could not generate AI insight. Please try again.')
      console.error('❌ Error generating insight:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentWeather) return null

  return (
    <div className="card border-2 border-purple-400 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Weather Insight</h2>
            <p className="text-sm opacity-70">Powered by intelligent analysis</p>
          </div>
        </div>
        <button
          onClick={generateInsight}
          disabled={isLoading}
          className="p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all disabled:opacity-50"
          title="Refresh insight"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="animate-spin text-4xl mb-4 text-purple-300" size={40} />
          <p className="text-lg font-medium">Analyzing weather patterns...</p>
          <p className="text-sm opacity-70 mt-2">Generating personalized insights</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-4 rounded-lg bg-red-500 bg-opacity-20 border border-red-400">
          <p className="text-red-300 font-medium">⚠️ {error}</p>
          <button
            onClick={generateInsight}
            className="mt-3 px-4 py-2 bg-red-500 bg-opacity-30 rounded-lg hover:bg-opacity-40 transition-all"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Insight Display - Gemini Style */}
      {aiInsight && !isLoading && !error && (
        <div className="space-y-6">
          {/* Quick Weather Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10">
              <div className="flex items-center gap-2 mb-1">
                <ThermometerSun size={16} className="text-orange-400" />
                <span className="text-xs opacity-70">Temperature</span>
              </div>
              <p className="text-xl font-bold">{getTemperature(currentWeather.current.temp_c, temperatureUnit)}</p>
            </div>
            <div className="p-3 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10">
              <div className="flex items-center gap-2 mb-1">
                <Wind size={16} className="text-blue-400" />
                <span className="text-xs opacity-70">Wind</span>
              </div>
              <p className="text-xl font-bold">{Math.round(currentWeather.current.wind_kph)} km/h</p>
            </div>
            <div className="p-3 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10">
              <div className="flex items-center gap-2 mb-1">
                <Droplets size={16} className="text-cyan-400" />
                <span className="text-xs opacity-70">Humidity</span>
              </div>
              <p className="text-xl font-bold">{currentWeather.current.humidity}%</p>
            </div>
            <div className="p-3 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10">
              <div className="flex items-center gap-2 mb-1">
                <CloudRain size={16} className="text-purple-400" />
                <span className="text-xs opacity-70">Rain Chance</span>
              </div>
              <p className="text-xl font-bold">
                {aiInsight.rainProbability !== undefined ? `${aiInsight.rainProbability}%` : 
                 currentWeather.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain !== undefined ? 
                 `${currentWeather.forecast.forecastday[0].day.daily_chance_of_rain}%` : 'N/A'}
              </p>
            </div>
          </div>

          {/* Personalized Allergy Alert (Priority) */}
          {aiInsight.personalizedAllergyAlert && (
            <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-400 border-opacity-40 animate-pulse-subtle">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-500 bg-opacity-30">
                  <AlertTriangle size={24} className="text-red-200 flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-red-200 mb-2 text-lg flex items-center gap-2">
                    ⚠️ Personalized Allergy Alert
                  </h4>
                  <p className="text-base leading-relaxed text-strong-contrast">{aiInsight.personalizedAllergyAlert}</p>
                </div>
              </div>
            </div>
          )}

          {/* General Allergy Alert */}
          {aiInsight.allergyAlert && !aiInsight.personalizedAllergyAlert && (
            <div className="p-4 rounded-xl bg-yellow-500 bg-opacity-10 border border-yellow-400 border-opacity-30">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-yellow-200 mb-1">Allergy Alert</h4>
                  <p className="text-sm opacity-90">{aiInsight.allergyAlert}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Insight */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white border-opacity-20">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500 bg-opacity-20 mt-1">
                <Sparkles size={18} className="text-purple-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2 text-purple-200">Weather Summary</h3>
                <p className="text-base leading-relaxed opacity-90">
                  {aiInsight.insight}
                </p>
              </div>
            </div>
          </div>

          {/* Suggestions - Gemini Card Style */}
          {aiInsight.suggestions && aiInsight.suggestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="text-2xl">💡</span>
                <span>Smart Recommendations</span>
              </h3>
              <div className="grid gap-3">
                {aiInsight.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 hover:bg-opacity-10 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="flex-1 text-sm leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                        {suggestion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white border-opacity-10 flex gap-3">
            <button
              onClick={generateInsight}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-bold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              <span>Regenerate Insight</span>
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs opacity-50 text-center">
            AI-generated insights are for informational purposes. Always check official weather sources for critical decisions.
          </p>
        </div>
      )}

      {/* Initial State */}
      {!aiInsight && !isLoading && !error && (
        <button
          onClick={generateInsight}
          className="w-full py-6 px-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center gap-3"
        >
          <Sparkles size={24} />
          <span>Generate AI Weather Insight</span>
        </button>
      )}
    </div>
  )
}
