import { IChamferableBodyDefinition } from 'matter-js'

export interface IGraphicsOptions {
  color: number
  alpha?: number
  radius?: number
}

export interface IGameObjectOptions {
  graphics: IGraphicsOptions
  body: IChamferableBodyDefinition
}

export const defaultGraphicsOptions = { color: 0xaaaaaa, alpha: 1} 
export const defaultBodyOptions = {}
export const defaultGameObjectOptions = {
  graphics: defaultGraphicsOptions,
  body: defaultBodyOptions
}
