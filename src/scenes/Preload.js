import Phaser from 'phaser'

class Preload extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    // Chunks
    this.load.tilemapTiledJSON('chunk0', 'assets/FirstChunk.json')
    this.load.tilemapTiledJSON('chunk1', 'assets/Chunk1.json')
    this.load.tilemapTiledJSON('chunk2', 'assets/Chunk2.json')
    this.load.tilemapTiledJSON('chunk3', 'assets/Chunk3.json')
    this.load.tilemapTiledJSON('chunk4', 'assets/Chunk4.json')
    this.load.tilemapTiledJSON('chunk5', 'assets/Chunk5.json')

    // TileSets
    this.load.image('tiles-1', 'assets/Tileset.png')

    // Background
    this.load.image('background-1', 'assets/Background/1.png')
    this.load.image('background-2', 'assets/Background/2.png')
    this.load.image('background-3', 'assets/Background/3.png')
    this.load.image('background-4', 'assets/Background/4.png')
    this.load.image('background-5', 'assets/Background/5.png')
    this.load.image('bg', 'assets/Background.png')

    // Player Sprite
    this.load.image('player', 'assets/cat_animations/Cat.png')

    // Player Animations
    this.load.spritesheet('jump', 'assets/cat_animations/Cat-Jump.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('fall', 'assets/cat_animations/Cat-Fall.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('run', 'assets/cat_animations/Cat-Run.png', {
      frameWidth: 32,
      frameHeight: 32,
    })

    // Obstacles
    this.load.image('Obstacle2', 'assets/Obstacles/Box1.png')
    this.load.image('Obstacle3', 'assets/Obstacles/Box2.png')
    this.load.image('Obstacle4', 'assets/Obstacles/Box3.png')
    this.load.image('Obstacle5', 'assets/Obstacles/Box4.png')
    this.load.image('Obstacle6', 'assets/Obstacles/Box5.png')
    this.load.image('Obstacle7', 'assets/Obstacles/Box6.png')
    this.load.image('Obstacle8', 'assets/Obstacles/Boxes1.png')
  }

  create() {
    // Define Q-learning parameters
    this.qTable = {} // Q-table to store the state-action values
    this.learningRate = 0.1 // Learning rate (alpha)
    this.discountFactor = 0.9 // Discount factor (gamma)
    this.epsilon = 0.2 // Epsilon value for epsilon-greedy policy
    this.currentState = [] // Current state of the game
    this.currentAction = 0 // Current action taken by the player
    this.previousState = [] // Previous state of the game
    this.previousAction = 0 // Previous action taken by the player
    this.reward = 0 // Reward received after taking an action
    this.totalScore = 0 // Total score earned by the player
    this.scene.start('PlayScene', {
      qTable: this.qTable,
      learningRate: this.learningRate,
      discountFactor: this.discountFactor,
      epsilon: this.epsilon,
      currentState: this.currentState,
      currentAction: this.currentAction,
      previousState: this.previousState,
      reward: this.reward,
      totalScore: this.totalScore,
    })
  }
}

export default Preload
