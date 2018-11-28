import * as P from 'pixi.js'
import { World } from 'matter-js'
import { IGameObject } from './game-object'

export default class Scene {
  _world: World
  _container: P.Container | null
  _gameObjects: Array<IGameObject> = []
  _liveObjects: Array<IGameObject> = []

  constructor(world: World, container: P.Container | null) {
    this._world = world
    this._container = container
  }

  addGameObject(gameObject: IGameObject) {
    World.addBody(this._world, gameObject.body)
    this._gameObjects.push(gameObject)
    if (!gameObject.body.isStatic) this._liveObjects.push(gameObject)

    if (this._container != null) this._container.addChild(gameObject.graphics)
  }

  add(gameObjects: Array<IGameObject>) {
    for (const gameObject of gameObjects) this.addGameObject(gameObject)
  }

  update() {
    for (const gameObject of this._liveObjects) {
      if (this._container != null) gameObject.syncGraphics()
      gameObject.update()
    }
  }
}
