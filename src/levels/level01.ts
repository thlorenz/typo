import { Level, LevelOptions } from '../base/level'

import levelData from '../../design/maps/level01.json'
import { ObjectsGame } from '../tiled/objects.game'
import { TilesTerrain } from '../tiled/tiles.terrain'

const TILES_TERRAIN = 'Tiles.Terrain'
const OBJECTS_GAME = 'Objects.Game'

const texts = [ 'jj', 'jk', 'kj', 'kk', 'kj' ]

export default class Level01 extends Level {
  constructor({
    viewportWidth,
    viewportHeight,
    tileset,
    renderParent = document.body,
    debugRenderParent = document.body
  }: LevelOptions) {

    const terrain = new TilesTerrain(
      TilesTerrain.findLayer(levelData.layers, TILES_TERRAIN),
      tileset
    )

    const objectsGame = new ObjectsGame(
      ObjectsGame.findLayer(levelData.layers, OBJECTS_GAME)
    )

    super(
      viewportWidth,
      viewportHeight,
      terrain,
      objectsGame,
      texts,
      renderParent,
      debugRenderParent
    )
  }
}
