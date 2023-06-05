import Phaser from 'phaser'

class Preload extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    this.load.tilemapTiledJSON('map', 'assets/FirstMap.json')
    this.load.image('tiles-1', 'assets/Tileset.png')
    this.load.image('tiles-2', 'assets/Background.png')
    this.load.image('player', 'assets/cat_animations/Cat.png')
  }

  create() {
    this.scene.start('PlayScene')
  }
}

export default Preload
