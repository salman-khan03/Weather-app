'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Loader } from 'lucide-react'
import { useWeatherStore } from '@/store/weatherStore'

interface AIInsightProps {
  location: any
}

export default function AIInsight({ location }: AIInsightProps) {
  const { currentWeather, aiInsight, setAIInsight } = useWeatherStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (currentWeather && location) {
      generateInsight()
    }
  }, [location])

  const generateInsight = async () => {
    if (!currentWeather) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/weather/insight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weatherData: currentWeather,
          location: location?.name || 'Current Location',
          locationId: location?.id || 'default',
          userId: 'demo-user',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate insight')
      }

      const data = await response.json()
      if (data.success && data.data) {
        setAIInsight(data.data)
      }
    } catch (err) {
      setError('Could not generate AI insight')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card border-blue-400">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={24} className="text-yellow-300" />
        <h2 className="text-2xl font-bold">AI Weather Insight</h2>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader className="spinner text-2xl" />
          <span className="ml-3">Analyzing weather...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-500 bg-opacity-20 border border-red-400 text-red-300">
          {error}
        </div>
      )}

      {aiInsight && !isLoading && (
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            {aiInsight.insight}
          </p>

          {aiInsight.suggestions && aiInsight.suggestions.length > 0 && (
            <div>
              <h3 className="font-bold mb-3 text-lg">💡 Smart Suggestions</h3>
              <ul className="space-y-2">
                {aiInsight.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-yellow-300 font-bold">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={generateInsight}
            disabled={isLoading}
            className="btn-secondary w-full mt-4"
          >
            Regenerate Insight
          </button>
        </div>
      )}

      {!aiInsight && !isLoading && !error && (
        <button
          onClick={generateInsight}
          className="btn-primary w-full"
        >
          Generate AI Insight
        </button>
      )}
    </div>
  )
}
