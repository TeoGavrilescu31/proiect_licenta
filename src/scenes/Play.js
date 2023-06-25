import Phaser from 'phaser'
import Player from '../entities/Player'

class Play extends Phaser.Scene {
  constructor() {
    super('PlayScene')
  }

  create() {
    const { chunk, ground } = this.createMap()
    this.chunk = chunk
    this.player = this.createPlayer()
    this.player.setScale(3)
    this.physics.add.collider(this.player, ground)
    this.cursors = this.input.keyboard.createCursorKeys()
    this.playerSpeed = 1000

    this.bgWidth = 18 * 32
    this.numBg = 6
    this.gameSpeed = 10

    this.jumps = 0

    this.bgs = []
    for (let i = 0; i < this.numBg; i++) {
      const background = this.add.sprite(i * this.bgWidth, 0, 'bg')
      background.setOrigin(0, 0)
      this.bgs.push(background)
    }

    this.maps = [{ chunk, ground }]
    for (let i = 1; i < this.numBg; i++) {
      const { chunk, ground } = this.createChunk()
      this.physics.add.collider(this.player, ground)
      ground.x = this.bgWidth * i
      this.maps.push({ chunk, ground })
    }
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('jump', {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'fall',
      frames: this.anims.generateFrameNumbers('fall', {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('run', {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    })
  }

  createMap() {
    const chunk = this.make.tilemap({
      key: 'chunk0',
    })
    this.tileset1 = chunk.addTilesetImage('Tileset', 'tiles-1')
    const ground = chunk.createLayer('Ground', this.tileset1)
    ground.setCollisionByProperty({ collides: true })
    return { chunk, ground }
  }

  // const background1 = map.addTilesetImage('1', 'background-1')
  // const background2 = map.addTilesetImage('2', 'background-2')
  // const background3 = map.addTilesetImage('3', 'background-3')
  // const background4 = map.addTilesetImage('4', 'background-4')
  // const background5 = map.addTilesetImage('5', 'background-5')

  // map.createLayer('Background1', background1)
  // map.createLayer('Background2', background2)
  // map.createLayer('Background3', background3)
  // map.createLayer('Background4', background4)
  // this.bg = map.createDynamicLayer('Background5', background5)

  // SHOW COLLISION TILES
  // const debugGraphics = this.add.graphics().setAlpha(0.7)
  // ground.renderDebug(debugGraphics, {
  //   tileColor: null,
  //   collidingTileColor: new Phaser.Display.Color(254, 254, 10, 255),
  //   faceColor: new Phaser.Display.Color(254, 10, 10, 255),
  // })

  createChunk() {
    const randomChunk = Phaser.Math.Between(0, 3)
    const chunk = this.make.tilemap({
      key: 'chunk' + randomChunk,
    })

    this.tileset1 = chunk.addTilesetImage('Tileset', 'tiles-1')
    const ground = chunk.createLayer('Ground', this.tileset1)
    ground.setCollisionByProperty({ collides: true })
    return { chunk, ground }
  }

  createPlayer() {
    return new Player(this, 200, 50)
  }

  update() {
    const { up, down } = this.cursors

    let onGround =
      this.player.body.blocked.down || this.player.body.touching.down

    if (up.isDown && this.jumps < 3) {
      this.player.setVelocityY(-this.playerSpeed)
      this.jumps++
    } else if (down.isDown && !onGround) {
      this.player.setVelocityY(this.playerSpeed)
    }

    // let touchingRight =
    //   this.player.body.blocked.right || this.player.body.touching.right

    // console.log('wall', touchingRight)

    if (onGround) {
      this.jumps = 0
    }

    this.maps.forEach((map) => {
      map.ground.x -= this.gameSpeed
    })

    this.bgs.forEach((bg) => {
      bg.x -= this.gameSpeed
    })

    if (this.bgs[0].x <= -this.bgWidth) {
      let firstBg = this.bgs.shift()
      firstBg.x = this.bgs[this.bgs.length - 1].x + this.bgWidth
      this.bgs.push(firstBg)
    }

    if (this.maps[0].ground.x <= -this.bgWidth) {
      this.maps.shift()
      const { chunk, ground } = this.createChunk()
      this.physics.add.collider(this.player, ground)
      ground.x = this.maps[this.maps.length - 1].ground.x + this.bgWidth
      this.maps.push({ chunk, ground })
    }

    if (this.player.body.velocity.y > 0) {
      this.player.anims.play('fall', true)
    } else if (this.player.body.velocity.y < 0) {
      this.player.anims.play('jump', true)
    } else if (onGround) {
      this.player.anims.play('run', true)
    }
    console.log(this.player.body.velocity.y)
  }
}

export default Play
