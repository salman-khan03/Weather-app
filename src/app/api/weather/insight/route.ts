import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/ai'
import { db } from '@/lib/supabase'
import type { WeatherData } from '@/types'

// Fallback function to generate insights without AI
function generateFallbackInsight(weatherData: WeatherData, location: string) {
  const temp = Math.round(weatherData.current.temp_c)
  const condition = weatherData.current.condition.text
  const humidity = weatherData.current.humidity
  const windSpeed = Math.round(weatherData.current.wind_kph)
  const uv = weatherData.current.uv
  const feelsLike = Math.round(weatherData.current.feelslike_c)
  const visibility = weatherData.current.vis_km

  // Weather condition analysis
  let weatherAnalysis = ''
  if (temp > 30) {
    weatherAnalysis = `It's quite hot in ${location} with temperatures reaching ${temp}°C. The heat index makes it feel like ${feelsLike}°C.`
  } else if (temp > 25) {
    weatherAnalysis = `Pleasant warm weather in ${location} at ${temp}°C, feeling like ${feelsLike}°C. Perfect for outdoor activities!`
  } else if (temp > 15) {
    weatherAnalysis = `Comfortable temperature in ${location} at ${temp}°C. ${condition} conditions with moderate temperatures.`
  } else if (temp > 5) {
    weatherAnalysis = `Cool weather in ${location} at ${temp}°C, feeling like ${feelsLike}°C. Consider wearing a light jacket.`
  } else {
    weatherAnalysis = `Cold conditions in ${location} at ${temp}°C. Bundle up! It feels even colder at ${feelsLike}°C.`
  }

  // Build suggestions array
  const suggestions = []

  // Temperature-based suggestions
  if (temp > 30) {
    suggestions.push('Stay hydrated - drink plenty of water throughout the day')
    suggestions.push('Wear light, breathable clothing in light colors')
    suggestions.push('Avoid strenuous outdoor activities during peak heat hours (12-4 PM)')
  } else if (temp > 25) {
    suggestions.push('Perfect weather for outdoor activities like picnics or sports')
    suggestions.push('Wear comfortable, breathable clothing')
    suggestions.push('Don\'t forget your sunglasses and light sun protection')
  } else if (temp > 15) {
    suggestions.push('Ideal temperature for a walk or outdoor dining')
    suggestions.push('Layer your clothing for comfort as temperature changes')
    suggestions.push('Great time for sightseeing or exploring the city')
  } else if (temp > 5) {
    suggestions.push('Wear a light jacket or sweater when going outside')
    suggestions.push('Good weather for indoor activities with short outdoor breaks')
    suggestions.push('Warm beverages would be enjoyable in this weather')
  } else {
    suggestions.push('Dress warmly in multiple layers')
    suggestions.push('Protect exposed skin from cold temperatures')
    suggestions.push('Perfect weather for cozy indoor activities')
  }

  // UV index suggestions
  if (uv >= 8) {
    suggestions.push('⚠️ Very high UV index - apply SPF 30+ sunscreen every 2 hours')
  } else if (uv >= 6) {
    suggestions.push('☀️ High UV levels - use sunscreen and wear a hat')
  } else if (uv >= 3) {
    suggestions.push('🕶️ Moderate UV - sun protection recommended for extended outdoor time')
  }

  // Wind suggestions
  if (windSpeed > 40) {
    suggestions.push('💨 Very windy conditions - secure loose items and be cautious outdoors')
  } else if (windSpeed > 25) {
    suggestions.push('🌬️ Windy weather - hold onto hats and umbrellas')
  }

  // Humidity suggestions
  if (humidity > 80) {
    suggestions.push('💧 High humidity makes it feel warmer - stay in air-conditioned spaces when possible')
  } else if (humidity < 30) {
    suggestions.push('🏜️ Low humidity - moisturize skin and stay hydrated')
  }

  // Visibility suggestions
  if (visibility < 5) {
    suggestions.push('🌫️ Reduced visibility - drive carefully with headlights on')
  }

  // Weather condition specific suggestions
  if (condition.toLowerCase().includes('rain')) {
    suggestions.push('☔ Carry an umbrella and wear waterproof clothing')
  } else if (condition.toLowerCase().includes('snow')) {
    suggestions.push('❄️ Snow conditions - wear warm, waterproof boots and layers')
  } else if (condition.toLowerCase().includes('storm') || condition.toLowerCase().includes('thunder')) {
    suggestions.push('⛈️ Thunderstorm risk - stay indoors and avoid unnecessary travel')
  }

  // Forecast-based suggestions
  const forecast = weatherData.forecast.forecastday[0]
  if (forecast) {
    const maxTemp = Math.round(forecast.day.maxtemp_c)
    const minTemp = Math.round(forecast.day.mintemp_c)
    const tempRange = maxTemp - minTemp
    
    if (tempRange > 15) {
      suggestions.push('🌡️ Large temperature variation today - dress in layers you can adjust')
    }

    if (forecast.day.daily_chance_of_rain > 60) {
      suggestions.push('🌧️ High chance of rain - keep an umbrella handy')
    }
  }

  // Get rain probability from weather data
  const rainProb = weatherData.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain || 0

  // Determine allergy alert
  let allergyAlert = null
  if (temp > 15 && temp < 25 && humidity < 60 && windSpeed > 15) {
    allergyAlert = "High pollen risk - warm, dry, and windy conditions favor pollen spread"
  } else if (humidity > 70 || weatherData.current.precip_mm > 0) {
    allergyAlert = "Moderate mold risk - high humidity may trigger mold allergies"
  } else if (temp < 10) {
    allergyAlert = "Low allergy risk - cold weather reduces pollen and mold activity"
  }

  return {
    insight: weatherAnalysis,
    suggestions: suggestions.slice(0, 6), // Limit to 6 suggestions
    rainProbability: rainProb,
    allergyAlert: allergyAlert,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { weatherData, location, userId } =
      await request.json() as {
        weatherData: WeatherData
        location: string
        userId: string
      }

    if (!weatherData || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Fetch user allergies if userId is provided
    let userAllergies: string[] = []
    if (userId) {
      try {
        const { data: userData } = await db.users.findById(userId)
        if (userData && userData.allergies && Array.isArray(userData.allergies)) {
          userAllergies = userData.allergies
          console.log('👤 User allergies loaded:', userAllergies)
        }
      } catch (error) {
        console.warn('⚠️ Could not fetch user allergies:', error)
      }
    }

    let insight

    // Try AI generation first with user allergies, fall back to rule-based if it fails
    try {
      insight = await aiService.generateWeatherInsight(weatherData, location, userAllergies)
      console.log('✅ AI insight generated successfully' + (userAllergies.length > 0 ? ' (with personalized allergy data)' : ''))
    } catch (error) {
      console.log('⚠️ AI service unavailable, using fallback insights')
      insight = generateFallbackInsight(weatherData, location)
    }

    // Try to save to database with proper user_id
    try {
      if (userId) {
        console.log('📝 Saving AI insight to Supabase for user:', userId)
        
        const insightToSave = {
          user_id: userId,
          location_name: location,
          lat: weatherData.location.lat,
          lon: weatherData.location.lon,
          insight: insight.insight,
          suggestions: insight.suggestions,
          rain_probability: insight.rainProbability || null,
          allergy_alert: insight.allergyAlert || null,
          created_at: new Date().toISOString(),
        }
        
        await db.aiInsights.create(insightToSave)
        console.log('✅ AI insight saved to Supabase successfully')
      }
    } catch (dbError) {
      console.error('⚠️ Database save failed, continuing without persistence:', dbError)
    }

    return NextResponse.json({
      success: true,
      data: insight,
    })
  } catch (error) {
    console.error('❌ Error generating weather insight:', error)
    return NextResponse.json(
      { error: 'Failed to generate insight' },
      { status: 500 }
    )
  }
}
