import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/ai'
import { db } from '@/lib/supabase'
import type { WeatherData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { weatherData, location, locationId, userId } =
      await request.json() as {
        weatherData: WeatherData
        location: string
        locationId: string
        userId: string
      }

    if (!weatherData || !location || !locationId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate AI insight
    const insight = await aiService.generateWeatherInsight(
      weatherData,
      location
    )

    // Save to database
    const saved = await db.aiInsights.create({
      user_id: userId,
      location_id: locationId,
      insight: insight.insight,
      suggestions: insight.suggestions,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      data: saved,
    })
  } catch (error) {
    console.error('Error generating weather insight:', error)
    return NextResponse.json(
      { error: 'Failed to generate insight' },
      { status: 500 }
    )
  }
}
