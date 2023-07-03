import Phaser from 'phaser'
import NeuralNetwork from '../NeuralNetwork'

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
    const inputSize = 7 // Number of elements in the state representation
    const outputSize = 2 // Number of possible actions: JUMP or DO_NOTHING
    this.qNetwork = new NeuralNetwork(inputSize, outputSize)
    this.scene.start('PlayScene', { qNetwork: this.qNetwork })
  }
}

export default Preload
