import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

// GET all approved testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    
    const testimonials = featured === 'true' 
      ? await db.testimonials.getFeatured()
      : await db.testimonials.getApproved()

    return NextResponse.json({
      success: true,
      data: testimonials,
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

// POST create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userName, userEmail, rating, title, content } = body

    if (!userId || !userName || !userEmail || !rating || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const testimonial = await db.testimonials.create({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      rating,
      title: title || null,
      content,
      is_approved: false,
      is_featured: false,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      data: testimonial,
      message: 'Testimonial submitted for approval',
    })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}
