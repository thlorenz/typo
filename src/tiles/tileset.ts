import { tilesetCastleGrey } from '../assets/img/tileset.castle-grey'
import { Point, Size } from '../types/geometry.js'
import { TileObjectGroup, TileSetRoot } from './tiled-types'

export const enum BodyType {
  Box = 0,
  Polygon = 1
}
export abstract class BodyDefinition {
  constructor(
    public bodyType: BodyType,
    public x: number,
    public y: number
  ) { }
}

export class BoxDefinition extends BodyDefinition {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number) { super(BodyType.Box, x, y) }
}

export class PolyDefinition extends BodyDefinition {
  constructor(
    public x: number,
    public y: number,
    public points: Point[]) { super(BodyType.Polygon, x, y) }
}

// SpriteInfo tells Pixi where in the Tileimage to find the tile
// using the Texture Packer format
class SpriteInfo {
  frame: Point & Size
  spriteSourceSize: Point & Size
  sourceSize: Size

  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    public rotated = false,
    public trimmed = false
  ) {
    this.frame = { x, y, w, h }
    this.spriteSourceSize = { x: 0, y: 0, w, h }
    this.sourceSize = { w, h }
  }
}

class SpritesMeta {
  scale = 1
  format = 'RGBA8888'
  constructor(public image: string, public size: Size) { }
}

type Frames = {
  [key: string]: SpriteInfo
}

export type SpritesPack = {
  frames: Frames
  meta: SpritesMeta
}

class SpritesPacker {
  static spriteId(idx: number, name: string) {
    return `${name}:${idx}`
  }

  constructor(
    private _sprites: SpriteInfo[],
    private _image: string,
    private _imageSize: Size,
    private _name: string) { }

  pack(): SpritesPack {
    const meta = new SpritesMeta(this._image, this._imageSize)
    const frames = this._sprites.reduce((acc: Frames, s, idx) => {
      acc[SpritesPacker.spriteId(idx + 1, this._name)] = s
      return acc
    }, {})
    return { frames, meta }
  }
}

export class Tileset {
  tileHeight: number
  tileWidth: number

  private _image: string
  private _imageSize: Size
  private _name: string
  private _tileCount: number
  private _column: number

  private _tileBodies: Map<number, BodyDefinition> = new Map()
  private _sprites: SpriteInfo[] = []
  private _spritesPack!: SpritesPack

  constructor(private _tileset: TileSetRoot) {
    this._image = this._tileset.image
    this._imageSize = {
      w: this._tileset.imagewidth,
      h: this._tileset.imageheight
    }
    this._name = this._tileset.name
    this._tileCount = this._tileset.tilecount
    this.tileHeight = this._tileset.tileheight
    this.tileWidth = this._tileset.tilewidth
    this._column = this._tileset.columns

    this._process()
  }

  body(tileIdx: number): BodyDefinition | null {
    return this._tileBodies.has(tileIdx) ? this._tileBodies.get(tileIdx)! : null
  }

  spriteId(tileIdx: number): string {
    return SpritesPacker.spriteId(tileIdx, this._name)
  }

  get spritesPack(): SpritesPack { return this._spritesPack }

  spritesPackDataUri() {
    // tslint:disable-next-line
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
    const dataUriMeta = new SpritesMeta(
      tilesetCastleGrey,
      this._spritesPack.meta.size)
    const spritesPack = Object.assign(this._spritesPack, { meta: dataUriMeta })
    const json = JSON.stringify(spritesPack)
    return `data:application/json;json,${json}`
  }

  private _process() {
    for (const tile of this._tileset.tiles) {
      this._processTile(tile)
    }
    this._addSprites()
    this._packSprites()
  }

  private _processTile(tile: TileObjectGroup) {
    for (const x of tile.objectgroup.objects) {
      let bodyDefinition
      // only supporting boxes and polygons at this point
      if (x.polygon != null) {
        bodyDefinition = new PolyDefinition(x.x, x.y, x.polygon)
      } else {
        bodyDefinition = new BoxDefinition(x.x, x.y, x.width, x.height)
      }
      // Tiled provides 1 based tile ids in map (0 indicating empty), but stores
      // them via 0 based ids in the tileset.
      // Therefore we fix this by making tileset ids 1 based as well.
      this._tileBodies.set(tile.id + 1, bodyDefinition)
    }
  }

  private _addSprites() {
    const rows = this._tileCount / this._column
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < this._column; col++) {
        const x = col * this.tileWidth
        const y = row * this.tileHeight
        this._sprites.push(
          new SpriteInfo(x, y, this.tileWidth, this.tileHeight)
        )
      }
    }
  }

  private _packSprites() {
    this._spritesPack = new SpritesPacker(
      this._sprites,
      this._image,
      this._imageSize,
      this._name
    ).pack()
  }
}
