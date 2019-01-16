import { Point } from '../types/geometry'

export type StringProperty = {
  name:
  | 'triggerId'
  type: 'string'
  value: string
}

export type Property = {
  name:
  | StringProperty['name']

  type:
  | StringProperty['type']

  value:
  | StringProperty['value']
}

export const isstring = (prop: Property): prop is StringProperty =>
  prop.type === 'string'

export type TileObject = Point & {
  id: number
  type: 'Player' | 'Trigger' | 'Bomb' | string
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

export type ObjectLayer = TileLayer & {
  objects: TileObject[]
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
