'use client'

import { useWeatherStore } from '@/store/weatherStore'
import { useEffect, useState } from 'react'

export default function WeatherBackground() {
  const { currentWeather } = useWeatherStore()
  const [rainDrops, setRainDrops] = useState<number[]>([])
  const [snowFlakes, setSnowFlakes] = useState<number[]>([])
  const [clouds, setClouds] = useState<number[]>([])
  const [stars, setStars] = useState<number[]>([])

  useEffect(() => {
    // Generate more rain drops for realistic effect
    setRainDrops(Array.from({ length: 200 }, (_, i) => i))
    // Generate more snow flakes
    setSnowFlakes(Array.from({ length: 100 }, (_, i) => i))
    // Generate more clouds
    setClouds(Array.from({ length: 12 }, (_, i) => i))
    // Generate more stars
    setStars(Array.from({ length: 150 }, (_, i) => i))
  }, [])

  if (!currentWeather) return null

  const condition = currentWeather.current.condition.text.toLowerCase()
  const isNight = currentWeather.current.is_day === 0

  const getWeatherType = () => {
    if (condition.includes('rain') || condition.includes('drizzle')) return 'rain'
    if (condition.includes('snow') || condition.includes('blizzard')) return 'snow'
    if (condition.includes('thunder') || condition.includes('storm')) return 'thunder'
    if (condition.includes('cloud') || condition.includes('overcast')) return 'cloudy'
    if (condition.includes('fog') || condition.includes('mist')) return 'fog'
    if (condition.includes('clear') || condition.includes('sun')) return isNight ? 'clear-night' : 'clear'
    return 'cloudy'
  }

  const weatherType = getWeatherType()

  return (
    <div className={`weather-bg weather-${weatherType}`}>
      {/* Rain Effect - Heavy realistic rain */}
      {weatherType === 'rain' && rainDrops.map((drop) => {
        const duration = 0.4 + Math.random() * 0.3
        const delay = Math.random() * 2
        const left = Math.random() * 100
        const height = 60 + Math.random() * 40
        
        return (
          <div
            key={`rain-${drop}`}
            className="rain-drop"
            style={{
              left: `${left}%`,
              height: `${height}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              opacity: 0.4 + Math.random() * 0.6,
            }}
          />
        )
      })}

      {/* Snow Effect - Realistic falling snow */}
      {weatherType === 'snow' && snowFlakes.map((flake) => {
        const size = 4 + Math.random() * 12
        const duration = 5 + Math.random() * 8
        const delay = Math.random() * 8
        const left = Math.random() * 100
        const swayDuration = 2 + Math.random() * 3
        
        return (
          <div
            key={`snow-${flake}`}
            className="snow-flake"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${duration}s, ${swayDuration}s`,
              animationDelay: `${delay}s, ${delay}s`,
            }}
          />
        )
      })}

      {/* Cloudy Effect - Moving clouds */}
      {weatherType === 'cloudy' && clouds.map((cloud) => {
        const width = 150 + Math.random() * 250
        const height = 80 + Math.random() * 120
        const top = Math.random() * 60
        const duration = 40 + Math.random() * 60
        const delay = Math.random() * 20
        const pulseDuration = 5 + Math.random() * 5
        
        return (
          <div
            key={`cloud-${cloud}`}
            className="cloud"
            style={{
              top: `${top}%`,
              width: `${width}px`,
              height: `${height}px`,
              animationDuration: `${duration}s, ${pulseDuration}s`,
              animationDelay: `${delay}s, 0s`,
            }}
          />
        )
      })}

      {/* Clear Day - Bright animated sun */}
      {weatherType === 'clear' && (
        <div className="sun" />
      )}

      {/* Clear Night - Twinkling stars */}
      {weatherType === 'clear-night' && stars.map((star) => {
        const size = 1 + Math.random() * 3
        const top = Math.random() * 70
        const left = Math.random() * 100
        const duration = 2 + Math.random() * 4
        const delay = Math.random() * 5
        const brightness = 0.3 + Math.random() * 0.7
        
        return (
          <div
            key={`star-${star}`}
            className="star"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              opacity: brightness,
            }}
          />
        )
      })}

      {/* Thunderstorm - Lightning + Heavy rain */}
      {weatherType === 'thunder' && (
        <>
          <div className="lightning" />
          {rainDrops.slice(0, 150).map((drop) => {
            const duration = 0.3 + Math.random() * 0.2
            const delay = Math.random() * 1.5
            const left = Math.random() * 100
            const height = 80 + Math.random() * 50
            
            return (
              <div
                key={`thunder-rain-${drop}`}
                className="rain-drop"
                style={{
                  left: `${left}%`,
                  height: `${height}px`,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                  opacity: 0.5 + Math.random() * 0.5,
                }}
              />
            )
          })}
        </>
      )}

      {/* Fog Effect - Drifting fog layers */}
      {weatherType === 'fog' && (
        <>
          {[1, 2, 3, 4].map((layer) => (
            <div
              key={`fog-${layer}`}
              className="fog-layer"
              style={{
                top: `${layer * 20}%`,
                animationDuration: `${15 + layer * 5}s`,
                animationDelay: `${layer * 2}s`,
                opacity: 0.4 + (layer * 0.1),
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}
