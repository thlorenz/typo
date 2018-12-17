import { Level } from './src/base/level'
import Level01 from './src/levels/level01'
import {
  addElementWithClass,
  removeAllWithClass,
  removeAllWithTag
} from './src/scene/browser-tasks'

const viewportWidth = 855
const viewportHeight = 480
const DEBUG = false
const RENDER = true

window.addEventListener('DOMContentLoaded', initGame)

function removeExistingGame(): void {
  removeAllWithTag('canvas')
  removeAllWithClass('simple-keyboard')
}

function init(): Level {
  removeExistingGame()
  addElementWithClass('simple-keyboard')
  return new Level01({
    viewportWidth,
    viewportHeight
  })
}

function initGame(): void {
  const level = init()
  level.init({ debug: DEBUG, render: RENDER })
  level.start()
}

/*
// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept(function accept() {
    initGame()
  })
}
*/
