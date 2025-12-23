/**
 * Temperature conversion utilities
 */

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5/9
}

export function formatTemperature(temp: number, unit: 'C' | 'F', decimals: number = 0): string {
  const rounded = Math.round(temp * Math.pow(10, decimals)) / Math.pow(10, decimals)
  return `${rounded}°${unit}`
}

export function convertTemperature(tempCelsius: number, targetUnit: 'C' | 'F'): number {
  if (targetUnit === 'F') {
    return celsiusToFahrenheit(tempCelsius)
  }
  return tempCelsius
}

export function getTemperature(tempCelsius: number, unit: 'C' | 'F', decimals: number = 0): string {
  const temp = convertTemperature(tempCelsius, unit)
  return formatTemperature(temp, unit, decimals)
}
