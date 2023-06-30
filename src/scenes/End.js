import Phaser from 'phaser'

class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene')
  }

  create() {
    const gameWidth = this.game.config.width
    const gameHeight = this.game.config.height

    this.cameras.main.setBackgroundColor('#37446e')

    const startText = this.add.text(
      gameWidth / 2,
      gameHeight / 2,
      'GAME OVER.\nPress any key to restart',
      {
        fontFamily: 'VT323',
        fontSize: '70px',
        fill: '#ffffff',
        align: 'center',
      }
    )
    startText.setOrigin(0.5)

    // Create a pulsating effect
    this.tweens.add({
      targets: startText,
      scaleX: 1.2,
      scaleY: 1.2,
      ease: 'Linear',
      duration: 1000,
      yoyo: true,
      repeat: -1,
    })

    this.input.keyboard.once('keydown', () => {
      window.dispatchEvent(new Event('gameRestarted'))
      this.scene.start('PreloadScene')
    })
  }
}

export default EndScene
