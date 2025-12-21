import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Weather, WeatherData } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY)

export const aiService = {
  generateWeatherInsight: async (
    weatherData: WeatherData,
    location: string
  ): Promise<{
    insight: string
    suggestions: string[]
  }> => {
    try {
      const prompt = `
You are a friendly weather assistant. Analyze the following weather data for ${location} and provide:
1. A brief, insightful description of the current weather
2. 3-5 practical suggestions based on the weather conditions

Weather Data:
- Current Temperature: ${weatherData.current.temp}°C (feels like ${weatherData.current.feels_like}°C)
- Condition: ${weatherData.current.main} - ${weatherData.current.description}
- Humidity: ${weatherData.current.humidity}%
- Wind Speed: ${weatherData.current.wind_speed} m/s
- Visibility: ${weatherData.current.visibility} meters
- UV Index: ${weatherData.current.uvi}
${weatherData.daily[0] ? `- High/Low Today: ${weatherData.daily[0].temp_max}°C / ${weatherData.daily[0].temp_min}°C` : ''}

Please provide your response in the following JSON format:
{
  "insight": "A friendly, informative description of the weather",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}
`

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Could not parse JSON from response')
      }

      const parsedResult = JSON.parse(jsonMatch[0])
      return parsedResult
    } catch (error) {
      console.error('Error generating weather insight:', error)
      // Return a fallback response
      return {
        insight: 'Weather analysis unavailable at the moment.',
        suggestions: [
          'Check the current conditions before heading out',
          'Dress appropriately for the temperature',
          'Stay hydrated',
        ],
      }
    }
  },

  generateActivityRecommendations: async (
    weatherData: WeatherData,
    location: string
  ): Promise<string[]> => {
    try {
      const prompt = `
Based on the following weather in ${location}, suggest 3-5 indoor and outdoor activities:

Temperature: ${weatherData.current.temp}°C
Condition: ${weatherData.current.main}
Humidity: ${weatherData.current.humidity}%
Wind Speed: ${weatherData.current.wind_speed} m/s

Provide ONLY a JSON array of activity suggestions:
["activity 1", "activity 2", "activity 3"]
`

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        return ['Check weather', 'Stay flexible', 'Plan ahead']
      }

      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error generating activity recommendations:', error)
      return ['Check weather', 'Stay flexible', 'Plan ahead']
    }
  },
}
