import axios from 'axios'
import type { WeatherData } from '@/types'

// OpenWeather API - Using API key from environment
const OPENWEATHER_API = 'https://api.openweathermap.org/data/2.5'
const OPENWEATHER_GEO_API = 'https://api.openweathermap.org/geo/1.0'

// Get API key from environment (client-side needs NEXT_PUBLIC_ prefix)
const getApiKey = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  if (!apiKey) {
    console.error('❌ NEXT_PUBLIC_OPENWEATHER_API_KEY not found in environment variables')
    throw new Error('OpenWeather API key not configured. Please add NEXT_PUBLIC_OPENWEATHER_API_KEY to .env.local')
  }
  return apiKey
}

interface OpenWeatherResponse {
  coord: { lon: number; lat: number }
  weather: Array<{ id: number; main: string; description: string; icon: string }>
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  visibility: number
  wind: { speed: number; deg: number; gust?: number }
  clouds: { all: number }
  rain?: { '1h'?: number; '3h'?: number }
  snow?: { '1h'?: number; '3h'?: number }
  dt: number
  sys: { country: string; sunrise: number; sunset: number }
  timezone: number
  name: string
}

interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number
    main: {
      temp: number
      feels_like: number
      temp_min: number
      temp_max: number
      pressure: number
      humidity: number
    }
    weather: Array<{ id: number; main: string; description: string; icon: string }>
    clouds: { all: number }
    wind: { speed: number; deg: number; gust?: number }
    visibility: number
    pop: number // Probability of precipitation
    rain?: { '3h'?: number }
    snow?: { '3h'?: number }
    dt_txt: string
  }>
  city: {
    name: string
    coord: { lat: number; lon: number }
    country: string
    timezone: number
    sunrise: number
    sunset: number
  }
}

interface GeocodingResult {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

// Weather code to condition mapping for OpenWeather
function getWeatherCondition(weatherId: number, description: string): string {
  // OpenWeather uses weather IDs: https://openweathermap.org/weather-conditions
  const conditions: Record<number, string> = {
    // Thunderstorm
    200: 'Thunderstorm with light rain',
    201: 'Thunderstorm with rain',
    202: 'Thunderstorm with heavy rain',
    210: 'Light thunderstorm',
    211: 'Thunderstorm',
    212: 'Heavy thunderstorm',
    221: 'Ragged thunderstorm',
    230: 'Thunderstorm with light drizzle',
    231: 'Thunderstorm with drizzle',
    232: 'Thunderstorm with heavy drizzle',
    // Drizzle
    300: 'Light drizzle',
    301: 'Drizzle',
    302: 'Heavy drizzle',
    310: 'Light drizzle rain',
    311: 'Drizzle rain',
    312: 'Heavy drizzle rain',
    313: 'Shower rain and drizzle',
    314: 'Heavy shower rain and drizzle',
    321: 'Shower drizzle',
    // Rain
    500: 'Light rain',
    501: 'Moderate rain',
    502: 'Heavy rain',
    503: 'Very heavy rain',
    504: 'Extreme rain',
    511: 'Freezing rain',
    520: 'Light shower rain',
    521: 'Shower rain',
    522: 'Heavy shower rain',
    531: 'Ragged shower rain',
    // Snow
    600: 'Light snow',
    601: 'Snow',
    602: 'Heavy snow',
    611: 'Sleet',
    612: 'Light shower sleet',
    613: 'Shower sleet',
    615: 'Light rain and snow',
    616: 'Rain and snow',
    620: 'Light shower snow',
    621: 'Shower snow',
    622: 'Heavy shower snow',
    // Atmosphere
    701: 'Mist',
    711: 'Smoke',
    721: 'Haze',
    731: 'Dust whirls',
    741: 'Fog',
    751: 'Sand',
    761: 'Dust',
    762: 'Volcanic ash',
    771: 'Squalls',
    781: 'Tornado',
    // Clear
    800: 'Clear sky',
    // Clouds
    801: 'Few clouds',
    802: 'Scattered clouds',
    803: 'Broken clouds',
    804: 'Overcast clouds'
  }
  return conditions[weatherId] || description || 'Unknown'
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

// Convert m/s to km/h
function msToKmh(ms: number): number {
  return ms * 3.6
}

// Convert Kelvin to Celsius
function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15
}

// Format Unix timestamp to time string
function formatTime(timestamp: number, timezoneOffset: number): string {
  const date = new Date((timestamp + timezoneOffset) * 1000)
  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// Transform OpenWeather current + forecast data to our WeatherData format
function transformOpenWeatherData(
  current: OpenWeatherResponse,
  forecast: OpenWeatherForecastResponse,
  locationName: string,
  country: string,
  region?: string
): WeatherData {
  const now = new Date()
  const timezoneOffset = current.timezone

  // Group forecast data by day
  const forecastByDay = new Map<string, typeof forecast.list>()
  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0]
    if (!forecastByDay.has(date)) {
      forecastByDay.set(date, [])
    }
    forecastByDay.get(date)!.push(item)
  })

  // Build forecast days
  const forecastDays = Array.from(forecastByDay.entries()).slice(0, 7).map(([date, dayData]) => {
    // Calculate daily min/max/avg temps
    const temps = dayData.map(d => d.main.temp)
    const maxTemp = Math.max(...temps)
    const minTemp = Math.min(...temps)
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length

    // Max wind speed for the day
    const maxWind = Math.max(...dayData.map(d => msToKmh(d.wind.speed)))

    // Total precipitation
    const totalPrecip = dayData.reduce((sum, d) => {
      return sum + (d.rain?.['3h'] || 0) + (d.snow?.['3h'] || 0)
    }, 0)

    // Max precipitation probability
    const maxPrecipProb = Math.max(...dayData.map(d => Math.round(d.pop * 100)))

    // Use midday weather for condition (or first available)
    const middayData = dayData.find(d => d.dt_txt.includes('12:00:00')) || dayData[0]
    const weatherCode = middayData.weather[0].id
    const weatherDesc = middayData.weather[0].description

    // Calculate UV index approximation based on clouds and time
    // OpenWeather free tier doesn't include UV, so we estimate
    const cloudCover = middayData.clouds.all
    const estimatedUV = Math.max(0, Math.round((11 - (cloudCover / 10)) * 0.7))

    // Build hourly data
    const hourData = dayData.map((item) => ({
      time: item.dt_txt,
      temp_c: Math.round(item.main.temp * 10) / 10,
      humidity: item.main.humidity,
      chance_of_rain: Math.round(item.pop * 100),
      will_it_rain: (item.rain?.['3h'] || 0) > 0 ? 1 : 0,
      condition: {
        text: getWeatherCondition(item.weather[0].id, item.weather[0].description),
        code: item.weather[0].id
      },
      wind_kph: Math.round(msToKmh(item.wind.speed) * 10) / 10,
      uv: estimatedUV
    }))

    return {
      date,
      day: {
        maxtemp_c: Math.round(maxTemp * 10) / 10,
        mintemp_c: Math.round(minTemp * 10) / 10,
        avgtemp_c: Math.round(avgTemp * 10) / 10,
        maxwind_kph: Math.round(maxWind * 10) / 10,
        totalprecip_mm: Math.round(totalPrecip * 10) / 10,
        daily_chance_of_rain: maxPrecipProb,
        daily_will_it_rain: totalPrecip > 0 ? 1 : 0,
        condition: {
          text: getWeatherCondition(weatherCode, weatherDesc),
          code: weatherCode
        },
        uv: estimatedUV
      },
      astro: {
        sunrise: formatTime(forecast.city.sunrise, 0),
        sunset: formatTime(forecast.city.sunset, 0)
      },
      hour: hourData
    }
  })

  // Current weather
  const currentTemp = current.main.temp
  const feelsLike = current.main.feels_like
  const weatherId = current.weather[0].id
  const weatherDesc = current.weather[0].description

  // Estimate UV based on cloud cover (OpenWeather free tier doesn't include UV)
  const cloudCover = current.clouds.all
  const hour = now.getHours()
  const isDaytime = hour >= 6 && hour < 18
  const estimatedUV = isDaytime ? Math.max(0, Math.round((11 - (cloudCover / 10)) * 0.7)) : 0

  return {
    location: {
      name: locationName,
      region: region || '',
      country: country,
      lat: current.coord.lat,
      lon: current.coord.lon,
      tz_id: `UTC${timezoneOffset >= 0 ? '+' : ''}${Math.round(timezoneOffset / 3600)}`,
      localtime: now.toISOString()
    },
    current: {
      temp_c: Math.round(currentTemp * 10) / 10,
      temp_f: Math.round((currentTemp * 9/5 + 32) * 10) / 10,
      is_day: isDaytime ? 1 : 0,
      condition: {
        text: getWeatherCondition(weatherId, weatherDesc),
        icon: `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
        code: weatherId
      },
      wind_kph: Math.round(msToKmh(current.wind.speed) * 10) / 10,
      wind_dir: getWindDirection(current.wind.deg),
      pressure_mb: current.main.pressure,
      precip_mm: (current.rain?.['1h'] || 0) + (current.snow?.['1h'] || 0),
      humidity: current.main.humidity,
      cloud: current.clouds.all,
      feelslike_c: Math.round(feelsLike * 10) / 10,
      feelslike_f: Math.round((feelsLike * 9/5 + 32) * 10) / 10,
      vis_km: Math.round(current.visibility / 1000 * 10) / 10,
      uv: estimatedUV,
      gust_kph: current.wind.gust ? Math.round(msToKmh(current.wind.gust) * 10) / 10 : msToKmh(current.wind.speed) * 1.5
    },
    forecast: {
      forecastday: forecastDays
    },
    alerts: {
      alert: []
    }
  }
}

export const weatherAPI = {
  async getWeatherByLocation(location: string): Promise<WeatherData> {
    try {
      console.log('🔍 Searching for location:', location)
      const apiKey = getApiKey()

      // First, geocode the location
      const geocodeResponse = await axios.get(`${OPENWEATHER_GEO_API}/direct`, {
        params: {
          q: location,
          limit: 1,
          appid: apiKey
        }
      })

      if (!geocodeResponse.data || geocodeResponse.data.length === 0) {
        throw new Error('Location not found')
      }

      const locationData: GeocodingResult = geocodeResponse.data[0]
      console.log('📍 Found location:', locationData)

      // Get current weather
      const currentResponse = await axios.get(`${OPENWEATHER_API}/weather`, {
        params: {
          lat: locationData.lat,
          lon: locationData.lon,
          appid: apiKey,
          units: 'metric' // Get temperatures in Celsius
        }
      })

      // Get 5-day forecast
      const forecastResponse = await axios.get(`${OPENWEATHER_API}/forecast`, {
        params: {
          lat: locationData.lat,
          lon: locationData.lon,
          appid: apiKey,
          units: 'metric'
        }
      })

      console.log('✅ Weather data received from OpenWeather')

      return transformOpenWeatherData(
        currentResponse.data,
        forecastResponse.data,
        locationData.name,
        locationData.country,
        locationData.state
      )
    } catch (error) {
      console.error('❌ Error fetching weather data:', error)
      throw error
    }
  },

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      console.log('🌍 Getting weather for coordinates:', lat, lon)
      const apiKey = getApiKey()

      // Get current weather
      const currentResponse = await axios.get(`${OPENWEATHER_API}/weather`, {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric'
        }
      })

      // Get 5-day forecast
      const forecastResponse = await axios.get(`${OPENWEATHER_API}/forecast`, {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric'
        }
      })

      console.log('✅ Weather data received from OpenWeather')

      const current: OpenWeatherResponse = currentResponse.data
      const forecast: OpenWeatherForecastResponse = forecastResponse.data

      // Try reverse geocoding for better location name
      let locationName = current.name || 'Current Location'
      let country = current.sys.country || ''
      let region = ''

      try {
        const reverseGeoResponse = await axios.get(`${OPENWEATHER_GEO_API}/reverse`, {
          params: {
            lat,
            lon,
            limit: 1,
            appid: apiKey
          }
        })

        if (reverseGeoResponse.data && reverseGeoResponse.data.length > 0) {
          locationName = reverseGeoResponse.data[0].name || locationName
          country = reverseGeoResponse.data[0].country || country
          region = reverseGeoResponse.data[0].state || ''
        }
      } catch (geoError) {
        console.warn('⚠️ Reverse geocoding failed, using default location name:', geoError)
      }

      return transformOpenWeatherData(
        current,
        forecast,
        locationName,
        country,
        region
      )
    } catch (error) {
      console.error('❌ Error fetching weather data:', error)
      throw error
    }
  },

  async searchLocations(query: string): Promise<any[]> {
    try {
      console.log('🔍 Searching locations:', query)
      const apiKey = getApiKey()

      const response = await axios.get(`${OPENWEATHER_GEO_API}/direct`, {
        params: {
          q: query,
          limit: 10,
          appid: apiKey
        }
      })

      if (!response.data) {
        return []
      }

      const locations = response.data.map((result: GeocodingResult, index: number) => ({
        id: index,
        name: result.name,
        region: result.state || '',
        country: result.country,
        lat: result.lat,
        lon: result.lon,
        url: `${result.name}, ${result.country}`
      }))

      console.log('✅ Found locations:', locations.length)
      return locations
    } catch (error) {
      console.error('❌ Error searching locations:', error)
      return []
    }
  }
}
