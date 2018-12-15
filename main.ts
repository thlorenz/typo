import { Level } from './src/base/level'
import Level01 from './src/levels/level01'

const viewportWidth = 855
const viewportHeight = 480
const DEBUG = false
const RENDER = true

window.addEventListener('DOMContentLoaded', initGame)

function removeExistingGame(): void {
  const canvases = document.body.getElementsByTagName('canvas')
  for (const c of canvases) {
    document.body.removeChild(c)
  }
  const keyboards = document.body.getElementsByClassName('simple-keyboard')
  for (const k of keyboards) {
    document.body.removeChild(k)
  }
}

function addKeyboardEl() {
  const keyb = document.createElement('div')
  keyb.className = 'simple-keyboard'
  document.body.appendChild(keyb)
}

function init(): Level {
  removeExistingGame()
  addKeyboardEl()
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

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept(function accept() {
    initGame()
  })
}
