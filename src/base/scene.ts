import { World } from 'matter-js'
import * as P from 'pixi.js'
import { TileScene } from '../tiles/tile-scene'
import { GameObject } from './game-object'

export default class Scene {
  private _tileScene: TileScene
  private _world: World
  private _container: P.Container | null
  private _gameObjects: GameObject[] = []
  private _liveObjects: GameObject[] = []

  get roleGameObjects() { return this._tileScene.roleGameObjects }

  constructor(
    tileScene: TileScene,
    world: World,
    container: P.Container | null
  ) {
    this._tileScene = tileScene
    this._world = world
    this._container = container
    this._init()
  }

  triggeredObject(tid: string) {
    if (!this.roleGameObjects.has(tid)) {
      throw new Error(`Could not find triggered object ${tid}`)
    }
    const triggeredObject = this.roleGameObjects.get(tid)!
    return triggeredObject
  }

  _init() {
    this.add(this._tileScene.staticGameObjects)
    this.add(this._tileScene.dynamicGameObjects)
  }

  addGameObject(gameObject: GameObject) {
    World.addBody(this._world, gameObject.body)
    this._gameObjects.push(gameObject)
    if (!gameObject.body.isStatic) this._liveObjects.push(gameObject)

    if (this._container != null && gameObject.graphics != null) {
      this._container.addChild(gameObject.graphics)
    }
  }

  add(gameObjects: GameObject[]) {
    for (const gameObject of gameObjects) this.addGameObject(gameObject)
  }

  update() {
    for (const gameObject of this._liveObjects) {
      if (this._container != null) gameObject.syncGraphics()
      gameObject.update()
    }
  }
}
