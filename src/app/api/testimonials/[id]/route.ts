import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

// GET user's testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  void request; // Mark as used for TypeScript
  try {
    const testimonial = await db.testimonials.getById(params.id)

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: testimonial,
    })
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    )
  }
}

// PUT update testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { rating, title, content } = body

    const updated = await db.testimonials.update(params.id, {
      rating,
      title,
      content,
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

// DELETE testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  void request; // Mark as used for TypeScript
  try {
    await db.testimonials.delete(params.id)

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}
