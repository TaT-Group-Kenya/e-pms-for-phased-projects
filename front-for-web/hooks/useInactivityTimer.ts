import { useEffect } from 'react'

interface UseInactivityTimerOptions {
  enabled?: boolean
  /**
   * Timeout in minutes before inactivity triggers.
   * If 0, null, or undefined, the timer is disabled.
   */
  timeoutMinutes?: number | null
  /**
   * Called once when the inactivity timeout elapses.
   */
  onTimeout: () => void
}

const DEFAULT_EVENTS: Array<keyof WindowEventMap> = [
  'click',
  'keydown',
  'mousemove',
  'scroll',
  'touchstart',
]

export function useInactivityTimer({
  enabled = true,
  timeoutMinutes,
  onTimeout,
}: UseInactivityTimerOptions): void {
  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return
    if (!timeoutMinutes || timeoutMinutes <= 0) return

    const timeoutMs = timeoutMinutes * 60_000
    let timerId: ReturnType<typeof setTimeout> | null = null

    const resetTimer = () => {
      if (timerId) {
        clearTimeout(timerId)
      }
      timerId = setTimeout(() => {
        onTimeout()
      }, timeoutMs)
    }

    const handleActivity = () => {
      resetTimer()
    }

    DEFAULT_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity)
    })

    // start initial timer
    resetTimer()

    return () => {
      if (timerId) {
        clearTimeout(timerId)
      }
      DEFAULT_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity)
      })
    }
  }, [enabled, timeoutMinutes, onTimeout])
}
