import * as P from 'pixi.js'
import { GameObject } from '../src/base/game-object'

declare module 'matter-js' {
  interface Body {
    gameObject: GameObject
  }
  interface IChamferableBodyDefinition {
    clone(): IChamferableBodyDefinition
  }
}
