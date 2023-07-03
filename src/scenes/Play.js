import Phaser from 'phaser'
import Player from '../entities/Player'
import Obstacle from '../entities/Obstacle'

class Play extends Phaser.Scene {
  constructor() {
    super('PlayScene')
  }

  create() {
    const { chunk, ground, walls, tileBackground } = this.createMap()
    this.score = 0
    this.chunk = chunk
    this.player = this.createPlayer()
    this.player.body.setMaxVelocityY(800)
    this.player.setScale(3)
    this.physics.add.collider(this.player, ground)
    this.physics.add.collider(this.player, walls, () => this.endGame())
    this.firstObstacle = this.spawnObstacle(this.game.config.width)
    this.obstacles = [this.firstObstacle]

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

    // Define Q-learning parameters
    // this.qTable = this.initialQ = data.qTable // Q-table to store the state-action values
    // this.learningRate = data.learningRate // Learning rate (alpha)
    // this.discountFactor = data.discountFactor // Discount factor (gamma)
    // this.epsilon = data.epsilon // Epsilon value for epsilon-greedy policy
    // this.currentState = data.currentState // Current state of the game
    // this.currentAction = data.currentAction // Current action taken by the player
    // this.previousState = data.previousState // Previous state of the game
    // this.previousAction = data.previousAction // Previous action taken by the player
    // this.reward = data.reward // Reward received after taking an action
    // this.totalScore = data.totalScore // Total score earned by the player

    // Define Q-learning parameters
    const storedQTable = localStorage.getItem('qTable')
    this.qTable = storedQTable ? JSON.parse(storedQTable) : {}
    this.learningRate = 0.1 // Learning rate (alpha)
    this.discountFactor = 0.9 // Discount factor (gamma)
    this.epsilon = 0.2 // Epsilon value for epsilon-greedy policy
    this.currentState = [] // Current state of the game
    this.currentAction = 0 // Current action taken by the player
    this.previousState = [] // Previous state of the game
    this.previousAction = 0 // Previous action taken by the player
    this.reward = 10 // Reward received after taking an action
    this.totalScore = 0 // Total score earned by the player
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

  // SHOW COLLISION TILES
  // const debugGraphics = this.add.graphics().setAlpha(0.7)
  // ground.renderDebug(debugGraphics, {
  //   tileColor: null,
  //   collidingTileColor: new Phaser.Display.Color(254, 254, 10, 255),
  //   faceColor: new Phaser.Display.Color(254, 10, 10, 255),
  // })

  createChunk() {
    const randomChunk = Phaser.Math.Between(0, 5)
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
    // this.scene.restart({
    //   qTable: this.qTable,
    //   learningRate: this.learningRate,
    //   discountFactor: this.discountFactor,
    //   epsilon: this.epsilon,
    //   currentState: this.currentState,
    //   currentAction: this.currentAction,
    //   previousState: this.previousState,
    //   reward: this.reward,
    //   totalScore: this.totalScore,
    // })
    localStorage.setItem('qTable', JSON.stringify(this.qTable))
    this.scene.restart()
    // this.scene.start('EndScene')
  }
  getCurrentState() {
    // Return the current state representation based on the game's state
    // You need to define your own logic here based on your game's state
    // For example, you can use the player's position, velocity, and the positions of obstacles as the state representation
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
      this.physics.add.collider(this.player, obstacle, () => this.endGame())
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

    // Initialize the current state if it is null
    if (this.currentState === []) {
      this.currentState = this.getCurrentState()
    }
    // Update Q-table based on the previous action and reward
    if (this.previousState !== null && this.previousAction !== null) {
      // Check if the current state is already in the Q-table
      if (!this.qTable.hasOwnProperty(this.currentState)) {
        this.qTable[this.currentState] = {}
      }

      // Check if the current action is already in the Q-table for the current state
      if (!this.qTable[this.currentState].hasOwnProperty(this.currentAction)) {
        this.qTable[this.currentState][this.currentAction] = 0
      }

      // Update the Q-value for the previous state-action pair using the Q-learning update rule
      const previousQValue =
        this.qTable[this.previousState][this.previousAction]
      const maxQValue = Math.max(
        ...Object.values(this.qTable[this.currentState])
      )
      const updatedQValue =
        previousQValue +
        this.learningRate *
          (this.reward + this.discountFactor * maxQValue - previousQValue)
      this.qTable[this.previousState][this.previousAction] = updatedQValue
    }

    // Choose the next action using an epsilon-greedy policy
    const actions = ['up', 'nothing'] // Possible actions in the game
    let nextAction = null

    if (Math.random() < this.epsilon) {
      // Randomly choose an action
      nextAction = Phaser.Math.RND.pick(actions)
      console.log('random:', nextAction)
    } else {
      // Choose the action with the highest Q-value for the current state
      const stateActions = this.qTable[this.currentState]
      nextAction = Object.keys(stateActions).reduce((a, b) =>
        stateActions[a] > stateActions[b] ? a : b
      )
      console.log('table:', nextAction)
    }

    // Take the chosen action
    if (nextAction === 'up' && this.jumps < 3) {
      this.player.setVelocityY(-this.playerSpeed)
      this.jumps++
    }

    // ...

    // Update the previous state and action for the next iteration
    this.previousState = this.currentState
    this.previousAction = this.currentAction

    // Update the current state and action with the new state and action
    this.currentState = this.getCurrentState()
    this.currentAction = nextAction
  }
}

export default Play
