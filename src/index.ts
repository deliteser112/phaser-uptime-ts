import Phaser from 'phaser'
import MainScene from './scenes/MainScene'

declare global {
  interface Window {
    phaserGame?: Phaser.Game
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1d1d1d',
  scene: [MainScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  title: 'Uptime Clock',
  parent: 'game'
}

if (!window['phaserGame']) {
  window['phaserGame'] = new Phaser.Game(config)
}