import Phaser from 'phaser'
import { formatTime, formatDateOnly } from '../utils/timeUtils'
import RngService, { RngError } from '../services/RngService'

export default class UptimeDisplay {
  private scene: Phaser.Scene
  private dateText: Phaser.GameObjects.Text
  private timeText: Phaser.GameObjects.Text
  private panel: Phaser.GameObjects.Graphics
  private theme = 'dark'
  private loadingBar: Phaser.GameObjects.Graphics
  private loadingText: Phaser.GameObjects.Text
  private statusText: Phaser.GameObjects.Text
  private isLoading = true
  private loadingEvent: Phaser.Time.TimerEvent | null = null
  private activeTweens: Phaser.Tweens.Tween[] = []

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    // Create loading elements
    this.loadingBar = scene.add.graphics()
    this.loadingText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, 'Loading...', {
      fontFamily: 'Orbitron',
      fontSize: '32px',
      color: '#00ffcc',
      stroke: '#002222',
      strokeThickness: 2
    }).setOrigin(0.5)

    // Create status text (initially hidden)
    this.statusText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 + 80, '', {
      fontFamily: 'Orbitron',
      fontSize: '24px',
      color: '#ff3333',
      stroke: '#220000',
      strokeThickness: 2
    }).setOrigin(0.5).setVisible(false)

    // Create main display elements (initially hidden)
    this.dateText = scene.add.text(40, 30, '', {
      fontFamily: 'Orbitron',
      fontSize: '32px',
      color: '#00ffcc',
      stroke: '#002222',
      strokeThickness: 2
    }).setVisible(false)

    this.panel = scene.add.graphics()
    this.panel.setVisible(false)  // Hide panel initially
    this.drawPanel()

    this.timeText = scene.add.text(scene.scale.width - 40, scene.scale.height - 30, '00:00:00', {
      fontFamily: 'Orbitron',
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#00ffff',
      strokeThickness: 2,
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#00ffff',
        blur: 8,
        fill: true
      }
    }).setOrigin(1, 1).setVisible(false)

    // Start loading animation
    this.startLoadingAnimation()
  }

  private startLoadingAnimation() {
    let progress = 0
    const barWidth = 300
    const barHeight = 20
    const x = this.scene.scale.width / 2 - barWidth / 2
    const y = this.scene.scale.height / 2 + 40

    // Draw initial background
    this.loadingBar.fillStyle(0x222222, 0.8)
    this.loadingBar.fillRoundedRect(x, y, barWidth, barHeight, 10)

    this.loadingEvent = this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        if (!this.isLoading) return

        progress = Math.min(progress + 5, 100)
        
        // Clear only the progress part
        this.loadingBar.clear()
        
        // Redraw background
        this.loadingBar.fillStyle(0x222222, 0.8)
        this.loadingBar.fillRoundedRect(x, y, barWidth, barHeight, 10)
        
        // Draw progress
        this.loadingBar.fillStyle(0x00ffcc, 0.8)
        this.loadingBar.fillRoundedRect(x, y, (barWidth * progress) / 100, barHeight, 10)

        // Stop the animation when we reach 100%
        if (progress >= 100) {
          this.loadingEvent?.remove()
          this.loadingEvent = null
        }
      },
      loop: true
    })
  }

  private drawPanel() {
    this.panel.clear()
    const color = this.theme === 'dark' ? 0x111111 : 0xffffff
    this.panel.fillStyle(color, 0.5)
    this.panel.fillRoundedRect(this.scene.scale.width - 240, this.scene.scale.height - 90, 220, 70, 12)
  }

  private cleanupTweens() {
    this.activeTweens.forEach(tween => tween.stop())
    this.activeTweens = []
  }

  private addTween(tween: Phaser.Tweens.Tween) {
    this.activeTweens.push(tween)
    tween.on('complete', () => {
      this.activeTweens = this.activeTweens.filter(t => t !== tween)
    })
  }

  update(days: number, h: number, m: number, s: number): void {
    if (this.isLoading) {
      // Stop the loading animation
      if (this.loadingEvent) {
        this.loadingEvent.remove()
        this.loadingEvent = null
      }

      // Hide loading elements with a fade out
      this.addTween(this.scene.tweens.add({
        targets: [this.loadingBar, this.loadingText],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.loadingBar.setVisible(false)
          this.loadingText.setVisible(false)
        }
      }))
      
      // Show main display elements with a fade in
      this.dateText.setVisible(true)
      this.timeText.setVisible(true)
      this.panel.setVisible(true)
      
      this.addTween(this.scene.tweens.add({
        targets: [this.dateText, this.timeText, this.panel],
        alpha: { from: 0, to: 1 },
        duration: 500
      }))
      
      this.isLoading = false
    }

    try {
      // Calculate total seconds and current date
      const totalSeconds = days * 86400 + h * 3600 + m * 60 + s
      const currentDate = RngService.getCurrentDate(totalSeconds)
      
      // Update displays with current values
      this.dateText.setText(formatDateOnly(currentDate))
      this.timeText.setText(formatTime(h, m, s))

      // Only animate the time display
      this.addTween(this.scene.tweens.add({
        targets: this.timeText,
        scale: { from: 1.05, to: 1 },
        duration: 150
      }))

      // Hide any error message
      this.statusText.setVisible(false)
    } catch (e) {
      console.error('[Display Error]', e)
      this.showError(e)
    }
  }

  pulseStrong(): void {
    // Only animate the time display
    this.addTween(this.scene.tweens.add({
      targets: this.timeText,
      scale: { from: 1.15, to: 1 },
      alpha: { from: 0.6, to: 1 },
      duration: 250
    }))
  }

  showError(error: unknown): void {
    this.cleanupTweens()
    
    let message = 'Error'
    if (error instanceof RngError) {
      switch (error.type) {
        case 'NETWORK':
          message = 'Network Error - Check your connection'
          break
        case 'API':
          message = 'Server Error - Try again later'
          break
        case 'DATA':
          message = 'Data Error - Contact support'
          break
        default:
          message = 'Unknown Error'
      }
    }

    this.statusText.setText(message)
    this.statusText.setVisible(true)
    
    this.timeText.setText('Error')
    this.timeText.setColor('#ff0033')
    this.dateText.setText('')

    // Pulse the error message
    this.addTween(this.scene.tweens.add({
      targets: this.statusText,
      scale: { from: 1.1, to: 1 },
      duration: 200,
      yoyo: true,
      repeat: 1
    }))
  }

  destroy(): void {
    this.cleanupTweens()
    if (this.loadingEvent) {
      this.loadingEvent.remove()
    }
  }
}
