import { Bodies, Engine, World } from 'matter-js'
import * as P from 'pixi.js'

import { TilesTerrain } from '../tiled/tiles.terrain'

import { BodyType, BoxDefinition, PolyDefinition } from '../tiled/tileset'

import { Point } from '../types/geometry'
import { BodyOptions } from './options'

export class LevelTerrain {
  constructor(
    private _engine: Engine,
    private _terrain: TilesTerrain
  ) { }

  addBodies() {
    const bodyOptions = new BodyOptions()
    bodyOptions.isStatic = true

    for (const tile of this._terrain.tiles) {
      const bodyDefinition = tile.bodyDefinition
      if (bodyDefinition == null) continue
      const { position } = tile

      if (bodyDefinition.bodyType === BodyType.Box) {
        this._addBoxBody(bodyDefinition as BoxDefinition, position, bodyOptions)
      } else {
        this._addPolyBody(
          bodyDefinition as PolyDefinition,
          position,
          bodyOptions)
      }
    }
  }

  renderBodies(container: P.Container) {
    for (const tile of this._terrain.tiles) {
      const sprite = P.Sprite.fromFrame(tile.spriteId)
      sprite.position.set(tile.position.x, tile.position.y)
      container.addChild(sprite)
    }
  }

  private _addBoxBody(
    box: BoxDefinition,
    position: Point,
    bodyOptions: BodyOptions
  ) {
    const { x, y, width, height } = box
    // matterjs wants the rectangle center for placement
    // additionally we need to add the offset of the body from
    // the tile's upper left corner
    const cx = position.x + (width / 2) + x
    const cy = position.y + (height / 2) + y
    const body = Bodies.rectangle(cx, cy, width, height, bodyOptions)
    World.addBody(this._engine.world, body)
  }

  private _addPolyBody(
    poly: PolyDefinition,
    position: Point,
    bodyOptions: BodyOptions
  ) {
    const { y, points } = poly

    // Adjust polygon origin so that matterjs places it correctly
    // It appears that Tiled stores it slightly differently
    const xoffset = (this._terrain.tileWidth / 2)
    const yoffset = (this._terrain.tileHeight / 2) + y

    const body = Bodies.fromVertices(
      position.x + xoffset,
      position.y + yoffset,
      [points],
      bodyOptions
    )
    World.addBody(this._engine.world, body)
  }
}
