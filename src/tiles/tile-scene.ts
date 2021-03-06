import { GameObject } from '../base/game-object'
import {
  GameObjectOptions,
  RoleType,
  roleTypeFromString
} from '../base/options'

import { Bomb } from '../entities/bomb'
import { Player } from '../entities/player'

import Box from '../primitives/box'
import { Circle } from '../primitives/circle'
import Poly from '../primitives/poly'
import { Point } from '../types/geometry'
import { unhandledCase } from '../util/guards'

const strict = false

type Radians = { radians: void } & number

interface BooleanProperty {
  name:
  | 'body.dynamic'
  | 'body.isSensor'
  type: 'bool'
  value: boolean
}

interface NumberProperty {
  name:
  | 'body.friction'
  | 'body.frictionAir'
  | 'body.frictionStatic'
  | 'body.density'
  type: 'int' | 'float'
  value: number
}

interface RoleTypeProperty {
  name: 'role.type'
  type: 'string'
  value: keyof typeof RoleType
}

interface StringProperty {
  name:
  | RoleTypeProperty['name']
  | 'role.id'
  | 'role.triggerId'
  type: 'string'
  value: string
}

interface Property {
  name:
  | BooleanProperty['name']
  | NumberProperty['name']
  | StringProperty['name']
  | RoleTypeProperty['name']

  type:
  | BooleanProperty['type']
  | NumberProperty['type']
  | StringProperty['type']

  value:
  | BooleanProperty['value']
  | NumberProperty['value']
  | StringProperty['value']
}

const isboolean = (prop: Property): prop is BooleanProperty =>
  prop.type === 'bool'
const isnumber = (prop: Property): prop is NumberProperty =>
  prop.type === 'int' || prop.type === 'float'
const isstring = (prop: Property): prop is StringProperty =>
  prop.type === 'string'

interface TileObject extends Point {
  id: number
  type: string
  name: string
  visible: boolean
  properties?: Property[]

  width: number
  height: number
  rotation: number

  polygon?: Point[]
  point?: boolean
  ellipse?: boolean
}

export interface TileLayer extends Point {
  draworder?: string
  id: number
  name: string
  type: string
  visible: boolean
  opacity: number

  objects: TileObject[]
}

export interface Tiled {
  width: number
  height: number
  tileheight: number
  infinite: boolean
  tilewidth: number
  type: string
  tiledversion: string
  version: number

  layers: TileLayer[]
}

const enum TileType { Box, Poly, Ellipse, Point }

type EntityCreator =
  (x: number, y: number, radius: number, opts: GameObjectOptions) => GameObject

function tileType(tile: TileObject): TileType {
  if (tile.point === true) return TileType.Point
  if (tile.ellipse === true) return TileType.Ellipse
  if (tile.polygon != null) return TileType.Poly

  return TileType.Box
}

function centerBox(tile: TileObject, rotation: Radians): Point {
  const rx = tile.width / 2
  const ry = tile.height / 2
  const diagRad = ry / rx as Radians
  rotation = rotation + diagRad as Radians

  const x = tile.x + rx * Math.cos(rotation)
  const y = tile.y + rx * Math.sin(rotation)

  return { x, y }
}

function centerCircle(tile: TileObject): Point {
  const rx = tile.width / 2
  const ry = tile.height / 2
  return { x: tile.x + rx, y: tile.y + ry }
}

export class TileScene {
  get staticGameObjects() { return this._staticGameObjects }
  get dynamicGameObjects() { return this._dynamicGameObjects }
  get roleGameObjects() { return this._roleGameObjects }

  //
  // Static helpers
  //
  static tileProperties(props?: Property[]): GameObjectOptions {
    const gameObjectOpts = new GameObjectOptions()
    if (props == null || props.length === 0) {
      return gameObjectOpts
    }
    for (const x of props) {
      if (isboolean(x)) {
        switch (x.name) {
          case 'body.dynamic': {
            gameObjectOpts.body.isStatic = !x.value
            break
          }
          case 'body.isSensor': {
            gameObjectOpts.body.isSensor = x.value
            break
          }
          default: unhandledCase(x.name)
        }
      } else if (isnumber(x)) {
        switch (x.name) {
          case 'body.friction': {
            gameObjectOpts.body.friction = x.value
            break
          }
          case 'body.frictionAir': {
            gameObjectOpts.body.frictionAir = x.value
            break
          }
          case 'body.frictionStatic': {
            gameObjectOpts.body.frictionStatic = x.value
            break
          }
          case 'body.density': {
            gameObjectOpts.body.density = x.value
            break
          }
          default: unhandledCase(x.name)
        }
      } else if (isstring(x)) {
        switch (x.name) {
          case 'role.type': {
            gameObjectOpts.role.type =
              roleTypeFromString((x as RoleTypeProperty).value)
            break
          }
          case 'role.id': {
            gameObjectOpts.role.id = x.value
            break
          }
          case 'role.triggerId': {
            gameObjectOpts.role.triggerId = x.value
            break
          }
          default: unhandledCase(x.name)
        }
      }
    }
    return gameObjectOpts
  }

  private _tileLayer: TileLayer
  private _staticGameObjects: GameObject[] = []
  private _dynamicGameObjects: GameObject[] = []
  private _roleGameObjects = new Map<string, GameObject>()

  constructor(tileLayer: TileLayer) {
    this._tileLayer = tileLayer
    this._extractGameObjects()
  }

  private _extractGameObjects() {
    for (const tile of this._tileLayer.objects) {
      this._extractGameObject(tile)
    }
  }

  private _extractGameObject(tile: TileObject) {
    const opts = TileScene.tileProperties(tile.properties)

    // Create entities for specific roles
    switch (opts.role.type) {
      case RoleType.Bomb: return this._addEntity(tile, Bomb.create, opts)
      case RoleType.Player: return this._addEntity(tile, Player.create, opts)
    }

    // Create primitives for everything else
    const ttype = tileType(tile)
    switch (ttype) {
      case TileType.Point: this._addPoint(tile, opts); break
      case TileType.Ellipse: this._addEllipse(tile, opts); break
      case TileType.Poly: this._addPoly(tile, opts); break
      case TileType.Box: this._addBox(tile, opts); break
      default: unhandledCase(ttype)
    }
  }

  private _addPoint(tile: TileObject, opts: GameObjectOptions) {
    if (strict) {
      throw new Error(`_addPoint(${tile}) not yet implemented, ${opts}`)
    }
  }

  private _addEntity(
    tile: TileObject,
    createEntity: EntityCreator,
    opts: GameObjectOptions
  ) {
    const rotation = tile.rotation * Math.PI / 180 as Radians
    const radius = Math.max(tile.width, tile.height) / 2
    const { x, y } = centerBox(tile, rotation)
    const entity = createEntity(x, y, radius, opts)
    this._addGameObject(entity, opts)
  }

  private _addEllipse(tile: TileObject, opts: GameObjectOptions) {
    // matterjs only supports circles, so we pick the width of the ellipse only
    const radius = tile.width / 2
    const { x, y } = centerCircle(tile)
    const circle = new Circle(x, y, radius, opts)
    this._addGameObject(circle, opts)
  }

  private _addPoly(tile: TileObject, opts: GameObjectOptions) {
    // tiled supplies position of first vertice in the array as position
    // not sure at this point how to translate position to matter
    // the dimensions and shape are rendered correctly, just posision is off
    const poly = new Poly(tile.x, tile.y, tile.polygon!)
    this._addGameObject(poly, opts)
  }

  private _addBox(tile: TileObject, opts: GameObjectOptions) {
    const rotation = tile.rotation * Math.PI / 180 as Radians
    const { x, y } = centerBox(tile, rotation)
    this._markCenter(x, y, opts.clone())
    const box = new Box(x, y, tile.width, tile.height, rotation, opts)
    this._addGameObject(box, opts)
  }

  private _addGameObject(gameObject: GameObject, opts: GameObjectOptions) {
    const { isStatic } = opts.body
    const { role } = opts
    if (isStatic) {
      this._staticGameObjects.push(gameObject)
    } else {
      this._dynamicGameObjects.push(gameObject)
    }
    if (role.type === RoleType.Bomb) {
      if (role.id == null) throw new Error('bombs need id')
      this._roleGameObjects.set(role.id, gameObject)
    } else if (role.type === RoleType.Trigger) {
      if (role.triggerId == null) throw new Error('triggers need triggerId')
    }
  }

  //
  // Diagnostics Helpers
  //
  private _markCenter(x: number, y: number, opts: GameObjectOptions) {
    opts.body.isSensor = true
    const circle = new Circle(x, y, 2, opts)
    this._addGameObject(circle, opts)
  }
}
