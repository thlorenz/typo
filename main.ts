import { Level } from './src/base/level'
import Level01 from './src/levels/level01'
import {
  addElementWithClass,
  removeAllWithClass,
  removeAllWithTag
} from './src/scene/browser-tasks'

const viewportWidth = 855
const viewportHeight = 480
const DEBUG = true
const RENDER = true

window.addEventListener('DOMContentLoaded', initGame)

function removeExistingGame(): void {
  removeAllWithTag('canvas')
  removeAllWithClass('simple-keyboard')
}

function init(tileset: Tileset): Level {
  removeExistingGame()
  addElementWithClass('simple-keyboard')
  return new Level01({
    viewportWidth,
    viewportHeight,
    tileset
  })
}

import castleTilesetData from './design/tilesets/castle/tile_castle_grey.json'
import { Tileset } from './src/tiled/tileset'
import { ResourceLoader } from './src/util/resources'

async function initGame(): Promise<void> {
  const castleTileset = new Tileset(castleTilesetData)
  const resourceLoader = new ResourceLoader(castleTileset)
  await resourceLoader.load()

  const level = init(castleTileset)
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
