import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const locationId = request.nextUrl.searchParams.get('locationId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      )
    }

    let data
    if (locationId) {
      data = await db.weatherHistory.getByLocation(locationId)
    } else {
      data = await db.weatherHistory.getByUser(userId)
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const record = {
      ...body,
      user_id: userId,
      created_at: new Date().toISOString(),
    }

    const result = await db.weatherHistory.create(record)
    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.error('Error creating history record:', error)
    return NextResponse.json(
      { error: 'Failed to create history record' },
      { status: 500 }
    )
  }
}
