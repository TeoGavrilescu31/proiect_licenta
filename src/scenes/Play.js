import Phaser from 'phaser'
import Player from '../entities/Player'
// import Obstacle from '../entities/Obstacle'

class Play extends Phaser.Scene {
  constructor() {
    super('PlayScene')
  }

  create() {
    const { chunk, ground, walls } = this.createMap()
    this.score = 0
    this.chunk = chunk
    this.player = this.createPlayer()
    this.player.body.setMaxVelocityY(800)
    this.player.setScale(3)
    this.physics.add.collider(this.player, ground)
    this.physics.add.collider(this.player, walls, () => this.endGame())

    this.cursors = this.input.keyboard.createCursorKeys()
    this.playerSpeed = 800
    // const firstObstacle = this.spawnObstacle(window.innerWidth + 100)
    // const secondObstacle = this.spawnObstacle(window.innerWidth + 300)
    // const thirdObstacle = this.spawnObstacle(window.innerWidth + 500)
    // this.obstacles = [firstObstacle, secondObstacle, thirdObstacle]
    // this.obstacles.forEach((obs) => this.physics.add.collider(obs, ground))
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

    this.maps = [{ chunk, ground, walls }]
    for (let i = 1; i < this.numBg; i++) {
      const { chunk, ground, walls } = this.createChunk()
      this.physics.add.collider(this.player, ground)
      this.physics.add.collider(this.player, walls, () => this.endGame())
      // this.obstacles.forEach((obs) => this.physics.add.collider(obs, ground))
      ground.x = this.bgWidth * i
      walls.x = this.bgWidth * i
      this.maps.push({ chunk, ground, walls })
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

    this.scoreText = this.add
      .text(10, 10, 'Score: 0', {
        fontFamily: 'VT323',
        fontSize: '64px',
        fill: '#000',
        align: 'right',
      })
      .setOrigin(0, 0)
  }

  createMap() {
    const chunk = this.make.tilemap({
      key: 'chunk0',
    })
    this.tileset1 = chunk.addTilesetImage('Tileset', 'tiles-1')
    const ground = chunk.createLayer('Ground', this.tileset1)
    const walls = chunk.createLayer('Walls', this.tileset1)
    ground.setCollisionByProperty({ collides: true })
    walls.setCollisionByProperty({ collides: true })
    ground.y = walls.y = this.game.config.height - 256
    return { chunk, ground, walls }
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
    const walls = chunk.createLayer('Walls', this.tileset1)
    ground.setCollisionByProperty({ collides: true })
    walls.setCollisionByProperty({ collides: true })
    ground.y = walls.y = this.game.config.height - 256
    return { chunk, ground, walls }
  }

  createPlayer() {
    return new Player(this, 200, 50)
  }

  // spawnObstacle(x) {
  //   const textureKey = Phaser.Math.Between(1, 8) // Randomize the obstacle's texture
  //   return new Obstacle(this, x + 200, 100, `Obstacle${textureKey}`)
  // }

  endGame() {
    const saveScore = () => {
      const highScores = JSON.parse(localStorage.getItem('highScores') || '[]')
      const newScore = { score: this.score }
      highScores.push(newScore)
      highScores.sort((a, b) => b.score - a.score)
      const updatedScores = highScores.slice(0, 10)
      localStorage.setItem('highScores', JSON.stringify(updatedScores))
    }
    saveScore()
    this.scene.start('EndScene')
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

    if (onGround) {
      this.jumps = 0
    }

    this.maps.forEach((map) => {
      map.ground.x -= this.gameSpeed
      if (map.walls) {
        map.walls.x -= this.gameSpeed
      }
    })

    this.bgs.forEach((bg) => {
      bg.x -= this.gameSpeed
    })

    // this.obstacles.forEach((obstacle) => (obstacle.x -= this.gameSpeed))

    if (this.bgs[0].x <= -this.bgWidth) {
      let firstBg = this.bgs.shift()
      firstBg.x = this.bgs[this.bgs.length - 1].x + this.bgWidth
      this.bgs.push(firstBg)
    }

    if (this.maps[0].ground.x <= -this.bgWidth) {
      this.maps.shift()
      const { chunk, ground, walls } = this.createChunk()
      this.physics.add.collider(this.player, ground)
      this.physics.add.collider(this.player, walls, () => this.endGame())
      ground.x = this.maps[this.maps.length - 1].ground.x + this.bgWidth
      walls.x = this.maps[this.maps.length - 1].walls.x + this.bgWidth
      this.maps.push({ chunk, ground, walls })
      this.score += 100
      this.scoreText.setText(`Score: ${this.score}`)
      this.gameSpeed += 0.1
    }

    console.log(this.score)

    // if (this.obstacles[0].x == 0) {
    //   this.obstacles[0].destroy()
    //   this.obstacles.shift()
    //   const newObstacle = this.spawnObstacle(window.innerWidth + 100)

    //   this.maps.forEach((map) =>
    //     this.physics.add.collider(newObstacle, map.ground)
    //   )
    //   this.obstacles.push(newObstacle)
    // }

    if (this.player.body.velocity.y > 0) {
      this.player.anims.play('fall', true)
    } else if (this.player.body.velocity.y < 0) {
      this.player.anims.play('jump', true)
    } else if (onGround) {
      this.player.anims.play('run', true)
    }

    if (this.player.y + 48 >= this.game.config.height || this.player.y <= 0) {
      this.endGame()
    }
  }
}

export default Play
