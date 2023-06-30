import Phaser from 'phaser'

class Obstacle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.init()
  }

  init() {
    // Customize the behavior and properties of the obstacle if needed
    // For example, set the gravity, velocity, or animations
    this.body.setGravityY(3000)
    this.setDepth(1)
  }
}

export default Obstacle
