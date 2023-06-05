import ReactDOM from 'react-dom'
import { App } from './App'
import Phaser from 'phaser'
import PlayScene from './scenes/Play'
import PreloadScene from './scenes/Preload'

const WIDTH = 1600
const HEIGHT = 640

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
}

const Scenes = [PreloadScene, PlayScene]
const createScene = (Scene) => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
    },
  },
  scene: initScenes(),
}
new Phaser.Game(config)

ReactDOM.render(<App />, document.getElementById('root'))
