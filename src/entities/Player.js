import Phaser from 'phaser'

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.init()
  }

  init() {
    this.setCollideWorldBounds(true)
    this.body.setGravityY(3000)
    this.setDepth(2)
  }
}

export default Player
