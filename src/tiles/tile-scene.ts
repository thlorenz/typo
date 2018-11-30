import { IGameObject } from '../base/game-object'
import { Point } from '../types/geometry';
import Box from '../primitives/box';
import Circle from '../primitives/circle';
import Poly from '../primitives/poly';

const strict = false

type Radians = { radians: void } & number

interface IProperty {
  name: 'dynamic'
  type: 'boolean'
  value: boolean
}

interface ITileProperties {
  dynamic: boolean
}

const defaultTileProperties: ITileProperties = {
  dynamic: false
}

interface ITileObject extends Point {
  id: number
  type: string
  name: string
  visible: boolean
  dynamic?: boolean
  properties: IProperty[] | null

  width: number
  height: number
  rotation: number

  polygon: Point[] | null
  point: boolean | null
  ellipse: boolean | null
}

export interface ITileLayer extends Point {
  draworder?: string
  id: number
  name: string
  type: string
  visible: boolean
  opacity: number

  objects: ITileObject[]
}

export interface ITiled {
  width: number
  height: number
  tileheight: number
  infinite: boolean
  tilewidth: number
  type: string
  tiledversion: string
  version: number

  layers: ITileLayer[]
}

const enum TileType { Box, Poly, Ellipse, Point }

function unhandledCase(x: never) {
  throw new Error(`Case ${x} not handled in switch statement`)
}

function tileType(tile: ITileObject): TileType {
  if (tile.point === true) return TileType.Point
  if (tile.ellipse === true) return TileType.Ellipse
  if (tile.polygon != null) return TileType.Poly

  return TileType.Box
}

function centerBox(tile: ITileObject, rotation: Radians): Point {
  const rx = tile.width / 2
  const ry = tile.height / 2
  const diagRad = ry / rx as Radians
  rotation = rotation + diagRad as Radians

  const x = tile.x + rx * Math.cos(rotation)
  const y = tile.y + rx * Math.sin(rotation)

  return { x, y }
}

function centerPolygon(tile: ITileObject): Point {
  console.log({
    x: tile.x,
    y: tile.y,
  })
  // XXX: adapting this properly is never exact, so use triangles sparingly for now
  const points = tile.polygon!
  if (points.length !== 3) throw new Error('Only polygon triangles supported')

  const width = points[2].x - points[0].x
  const height = points[1].y - points[0].y

  const x = tile.x + Math.round(width / 2)
  const y = tile.y + Math.round(height / 2)
  return { x, y }
}

function centerCircle(tile: ITileObject): Point {
  const rx = tile.width / 2
  const ry = tile.height / 2
  return { x: tile.x + rx, y: tile.y + ry }
}

export class TileScene {
  private _tileLayer: ITileLayer
  private _staticGameObjects: IGameObject[] = []
  private _dynamicGameObjects: IGameObject[] = []

  constructor(tileLayer: ITileLayer) {
    this._tileLayer = tileLayer
    this._extractGameObjects()
  }

  get staticGameObjects() { return this._staticGameObjects }
  get dynamicGameObjects() { return this._dynamicGameObjects }

  private _extractGameObjects() {
    for (const tile of this._tileLayer.objects) {
      this._extractGameObject(tile)
    }
  }

  private _extractGameObject(tile: ITileObject) {
    const ttype = tileType(tile)
    switch (ttype) {
      case TileType.Point: this._addPoint(tile); break
      case TileType.Ellipse: this._addEllipse(tile); break
      case TileType.Poly: this._addPoly(tile); break
      case TileType.Box: this._addBox(tile); break
      default: unhandledCase(ttype)
    }
  }

  private _addPoint(tile: ITileObject) {
    if (strict) throw new Error(`_addPoint(${tile}) not yet implemented`);
  }

  private _addEllipse(tile: ITileObject) {
    // matterjs only supports circles, so we pick the width of the ellipse only
    const radius = tile.width / 2
    const { x, y } = centerCircle(tile)
    const circle = new Circle(x, y, radius)
    this._addGameObject(circle, tile.properties)
  }

  private _addPoly(tile: ITileObject) {
    // tiled supplies position of first vertice as position
    const { x, y } = centerPolygon(tile)
    // four sides, determine width + height and add half of each
    const poly = new Poly(x, y, tile.polygon!)
    this._addGameObject(poly, tile.properties)
  }

  private _addBox(tile: ITileObject) {
    const rotation = tile.rotation * Math.PI / 180 as Radians
    const { x, y } = centerBox(tile, rotation)
    this._markCenter(x, y, tile.properties)
    const box = new Box(x, y, tile.width, tile.height, rotation)
    this._addGameObject(box, tile.properties)
  }

  private _addGameObject(gameObject: IGameObject, props: IProperty[] | null) {
    const { dynamic } = TileScene.tileProperties(props)
    if (dynamic) {
      this._dynamicGameObjects.push(gameObject)
    } else {
      gameObject.body.isStatic = true
      this._staticGameObjects.push(gameObject)
    }
  }

  //
  // Diagnostics Helpers
  //
  private _markCenter(x: number, y: number, props: IProperty[] | null) {
    const circle = new Circle(x, y, 2)
    this._addGameObject(circle, props)
  }

  //
  // Static helpers
  //
  static tileProperties(props: IProperty[] | null): ITileProperties {
    const properties = defaultTileProperties
    if (props == null || props.length === 0) {
      return properties
    }
    for (const x of props) {
      switch (x.name) {
        case 'dynamic': properties.dynamic = x.value; break
        default: unhandledCase(x.name)
      }
    }
    return properties
  }
}
