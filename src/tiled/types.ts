import { RoleType } from '../base/options'
import { Point } from '../types/geometry'

export type BooleanProperty = {
  name:
  | 'body.dynamic'
  | 'body.isSensor'
  type: 'bool'
  value: boolean
}

export type NumberProperty = {
  name:
  | 'body.friction'
  | 'body.frictionAir'
  | 'body.frictionStatic'
  | 'body.density'
  type: 'int' | 'float'
  value: number
}

export type RoleTypeProperty = {
  name: 'role.type'
  type: 'string'
  value: keyof typeof RoleType
}

export type StringProperty = {
  name:
  | RoleTypeProperty['name']
  | 'role.id'
  | 'role.triggerId'
  type: 'string'
  value: string
}

export type Property = {
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

export const isboolean = (prop: Property): prop is BooleanProperty =>
  prop.type === 'bool'
export const isnumber = (prop: Property): prop is NumberProperty =>
  prop.type === 'int' || prop.type === 'float'
export const isstring = (prop: Property): prop is StringProperty =>
  prop.type === 'string'

export type TileObject = Point & {
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

export type TileLayer = Point & {
  draworder?: string
  name: string
  type: string
  visible: boolean
  opacity: number
}

export type TilemapLayer = TileLayer & {
  data: number[]
  width: number
  height: number
}

export type TilesetLayer = TileLayer & {
  objects: TileObject[]
}

export type TileObjectGroup = {
  id: number
  objectgroup: TilesetLayer
}

type Tiles = {
  tileheight: number
  tilewidth: number
  type: string
  tiledversion: string
  version: number
}

export type Tiled = Tiles & {
  width: number
  height: number
  infinite: boolean

  layers?: TileLayer[]
}

export type TileSetRoot = Tiles & {
  name: string,
  image: string
  imageheight: number,
  imagewidth: number,
  tilecount: number,
  columns: number
  margin: number,
  spacing: number,
  tiles: TileObjectGroup[]
}

export const enum TileType { Box, Poly, Ellipse, Point }
