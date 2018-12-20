import { Level, LevelOptions } from '../base/level'

import levelData from '../../design/maps/level01.json'
import { TilesTerrain } from '../tiles/tiles.terrain'

const TILES_TERRAIN = 'Tiles.Terrain'

const texts = [ 'jj', 'jk', 'kj', 'kk', 'kj' ]

export default class Level01 extends Level {
  constructor({
    viewportWidth,
    viewportHeight,
    tileset,
    renderParent = document.body,
    debugRenderParent = document.body
  }: LevelOptions) {
    /*
    const objectLayer = tiled.layers.find(x => x.type === 'objectgroup')
    if (objectLayer == null) throw new Error('No object layer found in tilemap')
    const tileScene = new TileScene(objectLayer as TileLayer)
    */

    const terrain = new TilesTerrain(
      TilesTerrain.findLayer(levelData.layers, TILES_TERRAIN),
      tileset
    )
    super(
      viewportWidth,
      viewportHeight,
      terrain,
      texts,
      renderParent,
      debugRenderParent
    )
  }
}
