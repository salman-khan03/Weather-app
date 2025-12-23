// Haptic Feedback Utility - Google Weather Style
// Provides tactile feedback for user interactions

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

class HapticsManager {
  private isSupported: boolean = false

  constructor() {
    // Check for browser environment and vibration support
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      this.isSupported = 'vibrate' in navigator
    }
  }

  /**
   * Trigger haptic feedback
   * @param type - Type of haptic feedback
   */
  trigger(type: HapticType = 'light') {
    if (!this.isSupported || typeof navigator === 'undefined') return

    const patterns: Record<HapticType, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 50,
      success: [10, 50, 10],
      warning: [50, 100],
      error: [50, 100, 50]
    }

    const pattern = patterns[type]
    
    try {
      if (typeof pattern === 'number') {
        navigator.vibrate(pattern)
      } else {
        navigator.vibrate(pattern)
      }
    } catch (error) {
      // Silently fail if vibration not supported
      console.warn('Haptic feedback failed:', error)
    }
  }

  /**
   * Haptic feedback for button tap
   */
  tap() {
    this.trigger('light')
  }

  /**
   * Haptic feedback for selection
   */
  select() {
    this.trigger('medium')
  }

  /**
   * Haptic feedback for successful action
   */
  success() {
    this.trigger('success')
  }

  /**
   * Haptic feedback for error
   */
  error() {
    this.trigger('error')
  }

  /**
   * Haptic feedback for warning
   */
  warning() {
    this.trigger('warning')
  }

  /**
   * Haptic feedback for toggle/switch
   */
  toggle() {
    this.trigger('light')
  }

  /**
   * Haptic feedback for deletion
   */
  delete() {
    this.trigger('heavy')
  }

  /**
   * Haptic feedback for notification
   */
  notification() {
    if (typeof navigator !== 'undefined' && this.isSupported) {
      navigator.vibrate([30, 50, 30])
    }
  }

  /**
   * Check if haptics are supported
   */
  isHapticsSupported(): boolean {
    return this.isSupported
  }
}

// Export singleton instance
export const haptics = new HapticsManager()

// React hook for haptics
export function useHaptics() {
  return haptics
}
