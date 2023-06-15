import Phaser from 'phaser'
import Player from '../entities/Player'

class Play extends Phaser.Scene {
  constructor() {
    super('PlayScene')
  }

  create() {
    const { map, ground } = this.createMap()
    this.map = map
    this.player = this.createPlayer()
    this.physics.add.collider(this.player, ground)
    this.cursors = this.input.keyboard.createCursorKeys()
    this.playerSpeed = 1300

    this.bgWidth = 18 * 32
    this.numBg = 6
    this.gameSpeed = 1

    this.bgs = []
    for (let i = 0; i < this.numBg; i++) {
      const background = this.add.sprite(i * this.bgWidth, 0, 'bg')
      background.setOrigin(0, 0)
      this.bgs.push(background)
    }
  }

  createMap() {
    const map = this.make.tilemap({
      key: 'map',
    })

    this.tileset1 = map.addTilesetImage('Tileset', 'tiles-1')

    const background1 = map.addTilesetImage('1', 'background-1')
    const background2 = map.addTilesetImage('2', 'background-2')
    const background3 = map.addTilesetImage('3', 'background-3')
    const background4 = map.addTilesetImage('4', 'background-4')
    const background5 = map.addTilesetImage('5', 'background-5')

    map.createLayer('Background1', background1)
    map.createLayer('Background2', background2)
    map.createLayer('Background3', background3)
    map.createLayer('Background4', background4)
    this.bg = map.createDynamicLayer('Background5', background5)

    const ground = map.createLayer('Ground', this.tileset1)
    ground.setCollisionByProperty({ collides: true })

    // SHOW COLLISION TILES
    // const debugGraphics = this.add.graphics().setAlpha(0.7)
    // ground.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(254, 254, 10, 255),
    //   faceColor: new Phaser.Display.Color(254, 10, 10, 255),
    // })
    ground.setDepth(1)
    return { map, ground }
  }

  createPlayer() {
    return new Player(this, 200, 50)
  }

  update() {
    const { left, right, up, down } = this.cursors

    this.bgs.forEach((bg) => {
      bg.x -= this.gameSpeed
    })

    if (this.bgs[0].x <= -this.bgWidth) {
      let firstBg = this.bgs.shift()
      firstBg.x = this.bgs[this.bgs.length - 1].x + this.bgWidth
      this.bgs.push(firstBg)
    }

    this.gameSpeed += 0.001

    console.log(this.gameSpeed)

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
