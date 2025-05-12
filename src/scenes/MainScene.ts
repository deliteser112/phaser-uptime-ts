import Phaser from 'phaser'
import UptimeDisplay from '../ui/UptimeDisplay'
import RngService, { RngError } from '../services/RngService'
import { parseSecondsToTime } from '../utils/timeUtils'

export default class MainScene extends Phaser.Scene {
  private uptimeDisplay!: UptimeDisplay
  private fpsText!: Phaser.GameObjects.Text
  private elapsedSeconds = 0
  private lastUpdateTime = 0
  private readonly UPDATE_INTERVAL = 1000 // 1 second
  private readonly API_POLL_INTERVAL = 60000 // 1 minute
  private readonly PERFORMANCE_THRESHOLD = 16.67 // ~60 FPS
  private timeEvent: Phaser.Time.TimerEvent | null = null

  constructor() {
    super('main-scene')
  }

  preload() {
    this.load.image('bg', 'assets/images/bg.jpg')
    this.load.audio('tick', 'assets/sounds/tick.mp3')
  }

  create() {
    this.add.image(0, 0, 'bg').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height)

    this.uptimeDisplay = new UptimeDisplay(this)
    this.fetchUptime()

    // Set up API polling
    this.time.addEvent({
      delay: this.API_POLL_INTERVAL,
      callback: this.fetchUptime,
      callbackScope: this,
      loop: true
    })

    // Set up performance monitoring
    this.fpsText = this.add.text(10, this.scale.height - 20, '', {
      fontSize: '12px',
      color: '#aaaaaa'
    })

    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: this.updatePerformanceDisplay,
      callbackScope: this
    })

    // Disable input to prevent any mouse interaction
    this.input.setPollAlways()
    this.input.enabled = false
  }

  private updatePerformanceDisplay() {
    if (this.game.loop) {
      const fps = this.game.loop.actualFps
      if (fps !== undefined) {
        const color = fps >= this.PERFORMANCE_THRESHOLD ? '#00ff00' : '#ff0000'
        this.fpsText.setText(`FPS: ${Math.floor(fps)}`)
        this.fpsText.setColor(color)
      }
    }
  }

  tickClock() {
    // Only update if start date is ready
    try {
      RngService.getStartDate()
    } catch {
      return
    }
    this.elapsedSeconds++
    const { days, hours, minutes, seconds } = parseSecondsToTime(this.elapsedSeconds)
    this.uptimeDisplay.update(days, hours, minutes, seconds)
    this.sound.play('tick', { volume: 0.05 })
  }

  async fetchUptime() {
    try {
      const uptime = await RngService.getUptime()
      if (this.elapsedSeconds !== uptime) {
        this.elapsedSeconds = uptime
        const { days, hours, minutes, seconds } = parseSecondsToTime(this.elapsedSeconds)
        this.uptimeDisplay.update(days, hours, minutes, seconds)
      }
      // Start the timer if it hasn't started yet
      if (!this.timeEvent) {
        this.timeEvent = this.time.addEvent({
          delay: this.UPDATE_INTERVAL,
          callback: this.tickClock,
          callbackScope: this,
          loop: true,
          timeScale: 1
        })
      }
    } catch (e) {
      console.error('[Uptime Error]', e)
      this.uptimeDisplay.showError(e)
    }
  }

  shutdown() {
    if (this.timeEvent) {
      this.timeEvent.remove()
    }
    this.uptimeDisplay.destroy()
    this.sound.stopAll()
  }
}
