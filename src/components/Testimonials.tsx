'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Alex Rodriguez',
    role: 'Travel Blogger',
    comment: 'The 3D weather animations are absolutely breathtaking! This app makes checking the weather an enjoyable experience.',
    rating: 5,
    avatar: '🧑‍💼'
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'Photographer',
    comment: 'I rely on WeatherApp daily for planning my shoots. The AI insights help me make informed decisions about lighting and conditions.',
    rating: 5,
    avatar: '👩‍🎨'
  },
  {
    id: 3,
    name: 'James Mitchell',
    role: 'Outdoor Enthusiast',
    comment: 'The realistic rain and snow effects are incredible. Finally, a weather app that\'s both functional and beautiful!',
    rating: 5,
    avatar: '🧗‍♂️'
  },
  {
    id: 4,
    name: 'Sofia Anderson',
    role: 'Event Planner',
    comment: 'The 7-day forecast with detailed stats helps me plan outdoor events perfectly. Love the clean design!',
    rating: 5,
    avatar: '👩‍💼'
  }
]

export default function Testimonials() {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
            style={{
              filter: star <= rating ? 'drop-shadow(0 0 3px rgba(250, 204, 21, 0.6))' : 'none'
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="card fade-in">
      <h2 className="text-3xl font-bold mb-2 text-center text-strong-contrast">
        What Our Users Say
      </h2>
      <p className="text-center text-glass mb-8">
        Join thousands of satisfied users worldwide
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="p-6 rounded-2xl bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl border border-white/30 hover:from-white/25 hover:to-white/15 transition-all relative overflow-hidden"
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 opacity-20">
              <Quote size={48} className="text-white" />
            </div>

            <div className="relative z-10">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-bold text-lg text-strong-contrast">{testimonial.name}</h4>
                  <p className="text-sm text-glass">{testimonial.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Comment */}
              <p className="text-glass leading-relaxed italic">
                "{testimonial.comment}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
