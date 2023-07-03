import Phaser from 'phaser'
import Player from '../entities/Player'
import Obstacle from '../entities/Obstacle'

class Play extends Phaser.Scene {
  constructor() {
    super('PlayScene')
  }

  create(data) {
    this.learningRate = 0.1
    this.discountFactor = 0.9
    const { chunk, ground, walls, tileBackground } = this.createMap()
    this.score = 0
    this.chunk = chunk
    this.player = this.createPlayer()
    this.player.body.setMaxVelocityY(800)
    this.player.setScale(3)
    this.physics.add.collider(this.player, ground)
    this.physics.add.collider(this.player, walls, () => this.endGame())
    this.firstObstacle = this.spawnObstacle(this.game.config.width)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.playerSpeed = 800
    this.bgWidth = 18 * 32
    this.numBg = 6
    this.gameSpeed = 10

    this.jumps = 0

    this.bgs1 = []
    for (let i = 0; i < this.numBg; i++) {
      const background = this.add
        .sprite(i * this.bgWidth, 0, 'background-1')
        .setOrigin(0, 0)
      this.bgs1.push(background)
    }
    this.bgs2 = []
    for (let i = 0; i < this.numBg; i++) {
      const background = this.add
        .sprite(i * this.bgWidth, 0, 'background-2')
        .setOrigin(0, 0)
      this.bgs2.push(background)
    }
    this.bgs3 = []
    for (let i = 0; i < this.numBg; i++) {
      const background = this.add
        .sprite(i * this.bgWidth, 0, 'background-3')
        .setOrigin(0, 0)
      this.bgs3.push(background)
    }
    this.bgs4 = []
    for (let i = 0; i < this.numBg; i++) {
      const background = this.add
        .sprite(i * this.bgWidth, 0, 'background-4')
        .setOrigin(0, 0)
      this.bgs4.push(background)
    }
    this.bgs5 = []
    for (let i = 0; i < this.numBg; i++) {
      const background = this.add
        .sprite(i * this.bgWidth, 0, 'background-5')
        .setOrigin(0, 0)
      this.bgs5.push(background)
    }

    this.maps = [{ chunk, ground, walls, tileBackground }]
    this.obstacles = [this.firstObstacle]
    for (let i = 1; i < this.numBg; i++) {
      const { chunk, ground, walls, tileBackground } = this.createChunk()
      this.physics.add.collider(this.player, ground)
      this.physics.add.collider(this.player, walls, () => this.endGame())
      this.obstacles.forEach((obs) => this.physics.add.collider(obs, ground))
      ground.x = this.bgWidth * i
      walls.x = this.bgWidth * i
      tileBackground.x = this.bgWidth * i
      this.maps.push({ chunk, ground, walls, tileBackground })
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
    this.qNetwork = data.qNetwork
    console.log(this.qNetwork)
    this.gameLoop()
  }

  createMap() {
    const chunk = this.make.tilemap({
      key: 'chunk0',
    })
    this.tileset1 = chunk.addTilesetImage('Tileset', 'tiles-1')
    const tileBackground = chunk.createLayer('Background', this.tileset1)
    const ground = chunk.createLayer('Ground', this.tileset1)
    const walls = chunk.createLayer('Walls', this.tileset1)
    ground.setCollisionByProperty({ collides: true })
    walls.setCollisionByProperty({ collides: true })
    ground.y = walls.y = tileBackground.y = this.game.config.height - 256
    return { chunk, ground, walls, tileBackground }
  }

  createChunk() {
    const randomChunk = Phaser.Math.Between(0, 0)
    const chunk = this.make.tilemap({
      key: `chunk${randomChunk}`,
    })

    this.tileset1 = chunk.addTilesetImage('Tileset', 'tiles-1')
    const tileBackground = chunk.createLayer('Background', this.tileset1)
    const ground = chunk.createLayer('Ground', this.tileset1)
    const walls = chunk.createLayer('Walls', this.tileset1)
    ground.setCollisionByProperty({ collides: true })
    walls.setCollisionByProperty({ collides: true })
    ground.y = walls.y = tileBackground.y = this.game.config.height - 256

    return { chunk, ground, walls, tileBackground }
  }

  createPlayer() {
    return new Player(this, 200, 50)
  }

  spawnObstacle(x) {
    const textureKey = Phaser.Math.Between(2, 8) // Randomize the obstacle's texture
    return new Obstacle(this, x + 350, 100, `Obstacle${textureKey}`)
  }

  jump() {
    this.player.setVelocityY(-this.playerSpeed)
    this.jumps++
  }

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

  getState() {
    // Gather relevant information about the game state
    const playerX = this.player.x
    const playerY = this.player.y
    const playerVelY = this.player.body.velocity.y
    const obstacleX = this.obstacles[0].x
    const obstacleY = this.obstacles[0].y
    const distToObs = playerX - obstacleX
    const score = this.score

    // Return the state as an array or object
    return [
      playerX,
      playerY,
      playerVelY,
      obstacleX,
      obstacleY,
      distToObs,
      score,
    ]
  }

  qLearningUpdate(state, action, nextState, reward) {
    console.log('state', state)
    // Get the current Q-values for the current state
    const currentQValues = this.qNetwork.predict(state)
    console.log('currentQValues', currentQValues)

    // Get the Q-value for the chosen action
    const qValue = currentQValues[action]
    console.log('qValue', qValue)

    // Get the Q-values for the next state
    const nextQValues = this.qNetwork.predict(nextState)
    console.log('nextQValues', nextQValues)

    // Find the maximum Q-value for the next state
    const maxNextQValue = Math.max(...nextQValues)
    console.log('maxNextQValue', maxNextQValue)
    // Calculate the updated Q-value using the Q-learning equation
    const updatedQValue =
      qValue +
      this.learningRate *
        (reward + this.discountFactor * maxNextQValue - qValue)

    // Update the Q-values for the current state
    const updatedQValues = [...currentQValues]
    updatedQValues[action] = updatedQValue

    // Update the weights of the Q-network
    this.qNetwork.updateWeights(updatedQValues, state)
  }

  gameLoop() {
    // Get the current state
    const currentState = this.getState()

    // Choose an action (0 for JUMP, 1 for DO_NOTHING)
    const action = this.qNetwork
      .predict(currentState)
      .indexOf(Math.max(...this.qNetwork.predict(currentState)))
    console.log('action', action)

    // Perform the chosen action
    if (action === 0) {
      console.log('object')
      this.jump()
    }

    // Get the next state and reward
    const nextState = this.getState()
    console.log('nextState', nextState)
    const reward = this.calculateReward()
    console.log('reward', reward)

    // Update the Q-values
    this.qLearningUpdate(currentState, action, nextState, reward)

    // Check termination condition and continue or end the game loop
    if (this.gameOver) {
      this.restart()
      this.gameOver = false
    }
  }

  calculateReward() {
    // Get the player's position and size
    // Check for collision
    if (this.gameOver) {
      // Player has collided with an obstacle, give a negative reward
      return -1
    }

    // Player has not collided with an obstacle, give a positive reward
    return 1
  }

  restart() {
    this.scene.restart()
  }

  update() {
    const savedWeights = JSON.parse(JSON.stringify(this.qNetwork.weights))
    const { up, down } = this.cursors

    let onGround =
      this.player.body.blocked.down || this.player.body.touching.down

    if (up.isDown && this.jumps < 3) {
      this.jump()
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
      if (map.tileBackground) {
        map.tileBackground.x -= this.gameSpeed
      }
    })

    this.bgs1.forEach((bg) => {
      bg.x -= this.gameSpeed / 10
    })
    this.bgs2.forEach((bg) => {
      bg.x -= this.gameSpeed / 10
    })
    this.bgs3.forEach((bg) => {
      bg.x -= this.gameSpeed / 5
    })
    this.bgs4.forEach((bg) => {
      bg.x -= this.gameSpeed / 2.5
    })
    this.bgs5.forEach((bg) => {
      bg.x -= this.gameSpeed / 1.5
    })

    this.obstacles.forEach((obstacle) => (obstacle.x -= this.gameSpeed))
    this.obstacles.forEach((obstacle) => {
      this.physics.add.collider(
        this.player,
        obstacle,
        () => (this.gameOver = true)
      )
    })

    if (this.bgs1[0].x <= -this.bgWidth) {
      let firstBg = this.bgs1.shift()
      firstBg.x = this.bgs1[this.bgs1.length - 1].x + this.bgWidth
      this.bgs1.push(firstBg)
    }
    if (this.bgs2[0].x <= -this.bgWidth) {
      let firstBg = this.bgs2.shift()
      firstBg.x = this.bgs2[this.bgs2.length - 1].x + this.bgWidth
      this.bgs2.push(firstBg)
    }
    if (this.bgs3[0].x <= -this.bgWidth) {
      let firstBg = this.bgs3.shift()
      firstBg.x = this.bgs3[this.bgs3.length - 1].x + this.bgWidth
      this.bgs3.push(firstBg)
    }
    if (this.bgs4[0].x <= -this.bgWidth) {
      let firstBg = this.bgs4.shift()
      firstBg.x = this.bgs4[this.bgs4.length - 1].x + this.bgWidth
      this.bgs4.push(firstBg)
    }
    if (this.bgs5[0].x <= -this.bgWidth) {
      let firstBg = this.bgs5.shift()
      firstBg.x = this.bgs5[this.bgs5.length - 1].x + this.bgWidth
      this.bgs5.push(firstBg)
    }

    if (this.maps[0].ground.x <= -this.bgWidth) {
      this.maps.shift()
      const { chunk, ground, walls, tileBackground } = this.createChunk()
      this.physics.add.collider(this.player, ground)
      this.physics.add.collider(this.player, walls, () => this.endGame())
      ground.x = this.maps[this.maps.length - 1].ground.x + this.bgWidth
      walls.x = this.maps[this.maps.length - 1].walls.x + this.bgWidth
      tileBackground.x =
        this.maps[this.maps.length - 1].tileBackground.x + this.bgWidth
      this.maps.push({ chunk, ground, walls, tileBackground })
      const obstacle = this.spawnObstacle(ground.x)
      // obstacle.setScale(Phaser.Math.Between(1, 1.5, 2))
      this.obstacles.push(obstacle)
      this.physics.add.collider(obstacle, ground)
      this.score += 100
      this.scoreText.setText(`Score: ${this.score}`)
      this.gameSpeed += 0.1
    }

    if (this.obstacles[0] && this.obstacles[0].x <= 0 - this.gameSpeed) {
      this.obstacles[0].destroy()
    }

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

    this.gameLoop()
    this.qNetwork.weights = JSON.parse(JSON.stringify(savedWeights))
  }
}

export default Play
