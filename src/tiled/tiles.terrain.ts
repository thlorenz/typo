import { Point } from '../types/geometry.js'
import { cellPosition } from '../util/matrix.js'
import { findLayer } from './helpers.js'
import { BodyDefinition, SpritesPack, Tileset } from './tileset.js'
import { TileLayer, TilemapLayer } from './types'

export class TerrainTile {
  constructor(
    public position: Point,
    public spriteId: string,
    public bodyDefinition: BodyDefinition | null
  ) { }
}

export class TilesTerrain {

  get tiles() { return this._tiles }
  get spritesPack(): SpritesPack { return this._tileset.spritesPack }

  static findLayer(layers: TileLayer[], name: string): TilemapLayer {
    return findLayer(layers, name) as TilemapLayer
  }

  width: number
  height: number
  rows: number
  columns: number
  tileWidth: number
  tileHeight: number

  private _tiles: TerrainTile[] = []

  constructor(
    private _tilelayer: TilemapLayer,
    private _tileset: Tileset
  ) {
    this.tileWidth = this._tileset.tileWidth
    this.tileHeight = this._tileset.tileHeight

    this.rows = this._tilelayer.width
    this.columns = this._tilelayer.height
    this.width = this.columns * this.tileWidth
    this.height = this.rows * this.tileHeight
    this._process()
  }

  _process() {
    for (let cellIdx = 0; cellIdx < this._tilelayer.data.length; cellIdx++) {
      const tileIdx = this._tilelayer.data[cellIdx]
      if (tileIdx === 0) continue
      const position = this._positionInLayer(cellIdx)
      const spriteId = this._tileset.spriteId(tileIdx)
      const body = this._tileset.body(tileIdx)
      const tile = new TerrainTile(
        position,
        spriteId,
        body)
      this._tiles.push(tile)
    }
  }

  _positionInLayer(cellIdx: number): Point {
    return cellPosition(
      cellIdx,
      this.columns,
      this.tileWidth,
      this.tileHeight
    )
  }
}
