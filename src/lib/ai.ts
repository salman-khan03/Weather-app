import { GoogleGenerativeAI } from '@google/generative-ai'
import type { WeatherData } from '@/types'

// Initialize Gemini AI with API key from environment
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY or GOOGLE_API_KEY not found in environment variables')
  }
  return new GoogleGenerativeAI(apiKey)
}

export const aiService = {
  generateWeatherInsight: async (
    weatherData: WeatherData,
    location: string,
    userAllergies?: string[]
  ): Promise<{
    insight: string
    suggestions: string[]
    rainProbability: number
    allergyAlert: string | null
    personalizedAllergyAlert?: string
  }> => {
    try {
      const genAI = getGeminiClient()
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      // Build personalized allergy prompt if user has allergies
      const allergyPrompt = userAllergies && userAllergies.length > 0
        ? `\n\nIMPORTANT - Personalized Allergy Analysis:
The user has the following allergies: ${userAllergies.join(', ')}.
Please provide a specific "personalizedAllergyAlert" field analyzing how these weather conditions may affect their specific allergies:
- For pollen allergies: Consider temperature (15-25°C ideal for pollen), wind speed (high wind spreads pollen), humidity (low humidity increases pollen), and clear/sunny conditions
- For mold allergies: Consider high humidity (>70%), recent precipitation, damp conditions
- For grass allergies: Consider warm temperatures, dry conditions, wind
- For tree_pollen/ragweed: Consider seasonal factors, wind, dry conditions
- For dust allergies: Consider dry, windy conditions
- For pollution sensitivity: Consider visibility, wind patterns, cloud cover
- For humidity sensitivity: Consider high humidity levels

Provide specific, actionable advice for their allergies.`
        : ''

      const prompt = `You are a friendly weather assistant with expertise in health and allergies. Analyze the following weather data for ${location} and provide:
1. A brief, insightful description of the current weather (2-3 sentences)
2. 4-6 practical suggestions based on the weather conditions
3. General allergy risk assessment based on weather conditions${userAllergies && userAllergies.length > 0 ? '\n4. Personalized allergy alert for the user\'s specific allergies' : ''}

Weather Data:
- Current Temperature: ${weatherData.current.temp_c}°C (feels like ${weatherData.current.feelslike_c}°C)
- Condition: ${weatherData.current.condition.text}
- Humidity: ${weatherData.current.humidity}%
- Wind Speed: ${weatherData.current.wind_kph} km/h
- Wind Direction: ${weatherData.current.wind_dir}
- Visibility: ${weatherData.current.vis_km} km
- UV Index: ${weatherData.current.uv}
- Cloud Coverage: ${weatherData.current.cloud}%
- Precipitation: ${weatherData.current.precip_mm} mm
${weatherData.forecast?.forecastday?.[0] ? `- High/Low Today: ${weatherData.forecast.forecastday[0].day.maxtemp_c}°C / ${weatherData.forecast.forecastday[0].day.mintemp_c}°C` : ''}
${weatherData.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain ? `- Chance of Rain: ${weatherData.forecast.forecastday[0].day.daily_chance_of_rain}%` : ''}

General allergy risk factors to consider:
- Pollen levels (high on warm, dry, windy days with temps 15-25°C)
- Mold risk (high humidity >70%, recent rain)
- Air quality indicators (visibility, wind patterns)
- Seasonal factors${allergyPrompt}

Please provide your response in the following JSON format only (no markdown, no code blocks, just pure JSON):
{
  "insight": "A friendly, informative description of the weather with context and what it means for the day",
  "suggestions": ["practical suggestion 1", "practical suggestion 2", "practical suggestion 3", "practical suggestion 4"],
  "allergyAlert": "Brief general allergy risk assessment: none/low/moderate/high with reason, or null if no risk"${userAllergies && userAllergies.length > 0 ? ',\n  "personalizedAllergyAlert": "Specific alert for the user\'s allergies with actionable advice"' : ''}
}

Important: Return ONLY the JSON object, nothing else.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Try to parse JSON from the response
      let jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        // If no JSON found, try to extract it without code blocks
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        jsonMatch = cleanText.match(/\{[\s\S]*\}/)
      }

      if (!jsonMatch) {
        throw new Error('Could not parse JSON from Gemini response')
      }

      const parsedResult = JSON.parse(jsonMatch[0])
      
      // Validate the response structure
      if (!parsedResult.insight || !Array.isArray(parsedResult.suggestions)) {
        throw new Error('Invalid response structure from Gemini')
      }

      // Get rain probability from weather data
      const rainProb = weatherData.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain || 0

      return {
        insight: parsedResult.insight,
        suggestions: parsedResult.suggestions.slice(0, 6), // Limit to 6 suggestions
        rainProbability: rainProb,
        allergyAlert: parsedResult.allergyAlert || null,
        personalizedAllergyAlert: parsedResult.personalizedAllergyAlert || undefined,
      }
    } catch (error) {
      console.error('Error generating weather insight with Gemini:', error)
      
      // Return a fallback response with actual weather data
      const temp = Math.round(weatherData.current.temp_c)
      const condition = weatherData.current.condition.text
      const humidity = weatherData.current.humidity
      const windSpeed = Math.round(weatherData.current.wind_kph)
      const uv = weatherData.current.uv
      const rainProb = weatherData.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain || 0

      // Determine allergy risk
      let allergyAlert = null
      if (temp > 15 && temp < 25 && humidity < 60 && windSpeed > 15) {
        allergyAlert = "High pollen risk - warm, dry, and windy conditions favor pollen spread"
      } else if (humidity > 70 || weatherData.current.precip_mm > 0) {
        allergyAlert = "Moderate mold risk - high humidity may trigger mold allergies"
      } else if (temp < 10) {
        allergyAlert = "Low allergy risk - cold weather reduces pollen and mold activity"
      }

      return {
        insight: `Current weather in ${location}: ${condition} with ${temp}°C. ${
          temp > 25 ? 'It\'s warm outside!' : temp < 10 ? 'It\'s quite cold!' : 'Temperature is moderate.'
        } Humidity is at ${humidity}% and winds are blowing at ${windSpeed} km/h.`,
        suggestions: [
          temp > 25 ? 'Stay hydrated and wear light, breathable clothing' : temp < 10 ? 'Dress warmly in multiple layers' : 'Dress comfortably for moderate temperatures',
          uv > 6 ? 'Apply SPF 30+ sunscreen - UV levels are high' : 'UV levels are moderate, sun protection recommended for extended outdoor time',
          windSpeed > 30 ? 'Strong winds expected - secure loose items' : 'Wind conditions are manageable',
          humidity > 70 ? 'High humidity may make it feel warmer than actual temperature' : 'Comfortable humidity levels',
          weatherData.current.precip_mm > 0 ? 'Carry an umbrella - precipitation expected' : 'No rain expected, great for outdoor activities',
          condition.toLowerCase().includes('cloud') ? 'Cloudy conditions may provide natural sun protection' : 'Clear conditions - enjoy the visibility',
        ].slice(0, 6),
        rainProbability: rainProb,
        allergyAlert,
      }
    }
  },

  generateActivityRecommendations: async (
    weatherData: WeatherData,
    location: string
  ): Promise<string[]> => {
    try {
      const genAI = getGeminiClient()
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      const prompt = `Based on the following weather in ${location}, suggest 4-6 indoor and outdoor activities that would be ideal:

Temperature: ${weatherData.current.temp_c}°C
Condition: ${weatherData.current.condition.text}
Humidity: ${weatherData.current.humidity}%
Wind Speed: ${weatherData.current.wind_kph} km/h
UV Index: ${weatherData.current.uv}

Provide ONLY a JSON array of activity suggestions (no markdown, no code blocks):
["activity 1", "activity 2", "activity 3", "activity 4"]`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Try to extract JSON array
      let jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        jsonMatch = cleanText.match(/\[[\s\S]*\]/)
      }

      if (!jsonMatch) {
        throw new Error('Could not parse activities from Gemini response')
      }

      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error generating activity recommendations with Gemini:', error)
      
      // Fallback activities based on weather
      const temp = weatherData.current.temp_c
      const condition = weatherData.current.condition.text.toLowerCase()
      
      if (condition.includes('rain') || condition.includes('storm')) {
        return ['Visit a museum or art gallery', 'Indoor shopping', 'Catch up on reading at a cozy cafe', 'Indoor swimming or gym workout']
      } else if (temp > 28) {
        return ['Swimming or water sports', 'Indoor activities during peak heat', 'Evening outdoor dining', 'Visit air-conditioned venues']
      } else if (temp < 10) {
        return ['Visit indoor attractions', 'Hot beverage at a warm cafe', 'Indoor sports or activities', 'Museum or cultural center visit']
      } else {
        return ['Outdoor walk or hiking', 'Picnic in the park', 'Outdoor sports', 'Sightseeing and exploration', 'Outdoor dining', 'Photography walk']
      }
    }
  },
}
