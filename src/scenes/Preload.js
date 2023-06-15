import Phaser from 'phaser'

class Preload extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    this.load.tilemapTiledJSON('map', 'assets/FirstChunk.json')
    this.load.image('tiles-1', 'assets/Tileset.png')
    this.load.image('background-1', 'assets/Background/1.png')
    this.load.image('background-2', 'assets/Background/2.png')
    this.load.image('background-3', 'assets/Background/3.png')
    this.load.image('background-4', 'assets/Background/4.png')
    this.load.image('background-5', 'assets/Background/5.png')
    this.load.image('player', 'assets/cat_animations/Cat.png')

    this.load.image('bg', 'assets/Background.png')
  }

  create() {
    this.scene.start('PlayScene')
  }
}

export default Preload
