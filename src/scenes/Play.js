import Phaser from 'phaser'
import Player from '../entities/Player'

class Play extends Phaser.Scene {
  constructor() {
    super('PlayScene')
  }

  create() {
    const map = this.make.tilemap({ key: 'map' })
    const tileset1 = map.addTilesetImage('Tileset', 'tiles-1')
    const tileset2 = map.addTilesetImage('Background', 'tiles-2')

    map.createLayer('Background', tileset2)
    const ground = map.createLayer('Ground', tileset1)
    ground.setCollisionByProperty({ collides: true })

    this.player = this.createPlayer()
    this.physics.add.collider(this.player, ground)
    this.cursors = this.input.keyboard.createCursorKeys()
    this.playerSpeed = 1300
  }

  createPlayer() {
    const player = new Player(this, 200, 50)
    return player
  }

  update() {
    const { left, right, up, down } = this.cursors

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed)
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed)
    } else if (up.isDown) {
      this.player.setVelocityY(-this.playerSpeed)
    } else if (down.isDown) {
      this.player.setVelocityY(this.playerSpeed)
    } else this.player.setVelocityX(0)
  }
}

export default Play
