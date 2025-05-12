export class RngError extends Error {
  constructor(
    message: string,
    public type: 'NETWORK' | 'API' | 'DATA' | 'UNKNOWN',
    public retryable: boolean = true
  ) {
    super(message)
    this.name = 'RngError'
  }
}

export default class RngService {
  private static readonly API = 'https://rng.dev.anymaplay.com/uptime'
  private static readonly BASE_URL = 'https://rng.dev.anymaplay.com'
  private static startDate: Date | null = null
  private static readonly MAX_RETRIES = 3
  private static readonly RETRY_DELAY = 1000 // 1 second

  static async getUptime(retries = this.MAX_RETRIES): Promise<number> {
    const start = performance.now()
    try {
      // First get the start date if we don't have it
      if (!this.startDate) {
        const response = await fetch(this.BASE_URL)
        if (!response.ok) {
          throw new RngError(
            `Failed to fetch start date: HTTP ${response.status}`,
            'API',
            response.status >= 500
          )
        }
        const data = await response.json()
        if (!data.date) {
          throw new RngError('No date in response', 'DATA', false)
        }
        
        // Parse date from format "YYYYMMDD.HHMMSS"
        const dateStr = data.date
        const year = dateStr.substring(0, 4)
        const month = dateStr.substring(4, 6)
        const day = dateStr.substring(6, 8)
        const hour = dateStr.substring(9, 11)
        const minute = dateStr.substring(11, 13)
        const second = dateStr.substring(13, 15)
        
        this.startDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`)
        console.log('[API] Start date initialized:', this.startDate.toISOString())
      }

      // Then get the uptime
      const response = await fetch(this.API)
      if (!response.ok) {
        throw new RngError(
          `Failed to fetch uptime: HTTP ${response.status}`,
          'API',
          response.status >= 500
        )
      }
      const data = await response.json()
      if (typeof data !== 'number') {
        throw new RngError('Malformed uptime data', 'DATA', false)
      }

      const fetchTime = Math.floor(performance.now() - start)
      console.log(`[API] Uptime fetched in ${fetchTime}ms: ${data} seconds`)
      return data
    } catch (e) {
      console.warn('[API Error]', e)
      
      if (e instanceof RngError && e.retryable && retries > 0) {
        console.log(`[API] Retrying in ${this.RETRY_DELAY}ms... attempts left: ${retries}`)
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY))
        return this.getUptime(retries - 1)
      }

      throw e // Re-throw the error instead of using fallback
    }
  }

  static getCurrentDate(uptimeSeconds: number): Date {
    if (!this.startDate) {
      throw new RngError('Start date not initialized', 'DATA', false)
    }
    return new Date(this.startDate.getTime() + uptimeSeconds * 1000)
  }

  static getStartDate(): Date {
    if (!this.startDate) {
      throw new RngError('Start date not initialized', 'DATA', false)
    }
    return this.startDate
  }
}
