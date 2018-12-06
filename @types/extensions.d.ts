import { IGameObject } from '../src/base/game-object'

declare module 'matter-js' {
  interface Body {
    gameObject: IGameObject
  }
}
