import Phaser from 'phaser'
import PlayScene from './scenes/Play'
import PreloadScene from './scenes/Preload'
import StartScene from './scenes/Start'
import EndScene from './scenes/End'
import { useEffect } from 'react'
import Score from './components/atoms/Score'

const WIDTH = window.innerWidth // 18 * 32 // 18 tiles * 32 pixels
const HEIGHT = 18 * 32 //18 * 32 // 18 tiles * 32 pixels

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
}

const Scenes = [PreloadScene, StartScene, PlayScene, EndScene]
const createScene = (Scene) => new Scene(SHARED_CONFIG)
const initScenes = () => {
  const startScene = createScene(StartScene)
  const gameScenes = Scenes.map(createScene)
  return [startScene, ...gameScenes]
}

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  backgroundColor: '#37446e',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
    },
  },
  scene: initScenes(),
  initialScene: 'StartScene',
}

export const App = () => {
  useEffect(() => {
    new Phaser.Game(config)
  })
  return <Score />
}
