import { ILevel } from './src/base/level'
import Level01 from './src/levels/level01'

const viewportWidth = 640
const viewportHeight = 480

window.addEventListener('DOMContentLoaded', initGame)

function removeExistingGame(): void {
  const canvases = document.body.getElementsByTagName('canvas')
  for (const c of canvases) {
    document.body.removeChild(c)
  }
}

function init(): ILevel {
  removeExistingGame()
  return new Level01({
    viewportWidth,
    viewportHeight
  })
}

function initGame(): void {
  const level = init()
  level.init({ debug: true, render: false })
  level.start()
}

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept(function accept() {
    initGame()
  })
}
