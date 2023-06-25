import Phaser from 'phaser'
import PlayScene from './scenes/Play'
import PreloadScene from './scenes/Preload'
import { useEffect } from 'react'

const WIDTH = window.innerWidth // 18 * 32 // 18 tiles * 32 pixels
const HEIGHT = 18 * 32 //18 * 32 // 18 tiles * 32 pixels

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

export const App = () => {
  useEffect(() => {
    new Phaser.Game(config)
  })
  return <></>
}
