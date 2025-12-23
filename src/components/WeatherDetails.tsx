'use client'

import { Wind, Droplets, Eye, Gauge } from 'lucide-react'
import type { WeatherData } from '@/types'

interface WeatherDetailsProps {
  weather: WeatherData
}

export default function WeatherDetails({ weather }: WeatherDetailsProps) {
  const details = [
    {
      icon: Wind,
      label: 'Wind Speed',
      value: `${weather.current.wind_kph} km/h`,
      direction: `${weather.current.wind_dir}`,
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.current.humidity}%`,
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${weather.current.vis_km} km`,
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${weather.current.pressure_mb} mb`,
    },
  ]

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Weather Details</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {details.map((detail, index) => {
          const Icon = detail.icon
          return (
            <div key={index} className="text-center">
              <Icon size={32} className="mx-auto mb-3 opacity-80" />
              <p className="text-sm opacity-80 mb-2">{detail.label}</p>
              <p className="text-xl font-bold">{detail.value}</p>
              {detail.direction && (
                <p className="text-xs opacity-60">{detail.direction}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-white border-opacity-20 grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <p className="text-sm opacity-80">Cloud Coverage</p>
          <p className="text-2xl font-bold">{weather.current.cloud}%</p>
        </div>
        <div>
          <p className="text-sm opacity-80">UV Index</p>
          <p className="text-2xl font-bold">{weather.current.uv}</p>
        </div>
        {weather.current.precip_mm > 0 && (
          <div>
            <p className="text-sm opacity-80">Precipitation</p>
            <p className="text-2xl font-bold">{weather.current.precip_mm} mm</p>
          </div>
        )}
      </div>
    </div>
  )
}
