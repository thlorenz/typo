import { Level, LevelOptions } from '../base/level'
import { TileLayer, TileScene } from '../tiles/tile-scene'

import * as tiled from '../../design/level01/static.layer.tiled.json'

const texts = [ 'jj', 'jk', 'kj', 'kk', 'kj' ]

export default class Level01 extends Level {
  constructor({
    viewportWidth,
    viewportHeight,
    renderParent = document.body,
    debugRenderParent = document.body
  }: LevelOptions) {
    const objectLayer = tiled.layers.find(x => x.type === 'objectgroup')
    if (objectLayer == null) throw new Error('No object layer found in tilemap')
    const tileScene = new TileScene(objectLayer as TileLayer)

    super(tileScene, texts, {
      levelWidth: 2000,
      levelHeight: 5000,
      viewportWidth,
      viewportHeight,
      renderParent,
      debugRenderParent
    })
  }
}
