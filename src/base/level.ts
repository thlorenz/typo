import {
  Engine,
  Render,
  World
} from 'matter-js'
import * as P from 'pixi.js'

import {
  CollisionEvent,
  Collisions,
  SensorTriggerHandler
} from '../scene/collisions'
import { TileScene } from '../tiles/tile-scene'
import { GameObject } from './game-object'

export interface LevelOptions {
  viewportWidth: number
  viewportHeight: number

  renderParent?: HTMLElement
  debugRenderParent?: HTMLElement
}

interface AllLevelOptions extends LevelOptions {
  levelWidth: number
  levelHeight: number
}

export abstract class Level implements Level {
  private _tileScene: TileScene

  protected get engine() { return this._engine }

  private _levelWidth: number
  private _levelHeight: number

  private _viewportWidth: number
  private _viewportHeight: number

  private _renderParent: HTMLElement
  // @ts-ignore will use in the future
  private _debugRenderParent: HTMLElement

  private _engine: Engine
  private _collisions: Collisions

  private _debugRender: Render | null = null
  private _render: P.Container | null = null
  private _app: P.Application | null = null

  private _gameObjects: GameObject[] = []
  private _liveObjects: GameObject[] = []

  constructor(tileScene: TileScene, {
    levelWidth,
    levelHeight,
    viewportWidth,
    viewportHeight,
    renderParent = document.body,
    debugRenderParent = document.body
  }: AllLevelOptions) {
    this._tileScene = tileScene
    this._levelWidth = levelWidth
    this._levelHeight = levelHeight
    this._viewportWidth = viewportWidth
    this._viewportHeight = viewportHeight
    this._renderParent = renderParent
    this._debugRenderParent = debugRenderParent

    this._engine = Engine.create()
    this._collisions =
      new Collisions(this._engine, this._tileScene.roleGameObjects)
  }

  init({ debug = true, render = true }) {
    if (debug) this._initDebugRender()
    if (render) this._initRender()
    if (this._app != null) this._render = this._app.stage
    this
      ._add(this._tileScene.staticGameObjects)
      ._add(this._tileScene.dynamicGameObjects)
      ._subscribeCollisions()
  }

  start() {
    if (this._debugRender != null) Render.run(this._debugRender)
    Engine.run(this._engine)
  }

  protected updateLevel(): void { }

  private _update = () => {
    for (const gameObject of this._liveObjects) {
      if (this._render != null) gameObject.syncGraphics()
      gameObject.update()
    }
    this.updateLevel()
  }

  private _initRender() {
    this._app = new P.Application(
      this._viewportWidth,
      this._viewportHeight,
      { backgroundColor: 0x222222, transparent: true }
    )
    this._renderParent.appendChild(this._app.view)
    this._app.ticker.add(this._update)
  }

  private _initDebugRender() {
    this._debugRender = Render.create({
      element: document.body,
      engine: this._engine,
      options: {
        width: this._levelWidth,
        height: this._levelHeight,
        wireframes: true
      }
    })
  }

  private _subscribeCollisions(): this {
    this._collisions
      .on(CollisionEvent.SensorTrigger, this._onsensorTrigger)
    return this
  }

  private _add(gameObjects: GameObject[]): this {
    for (const gameObject of gameObjects) this._addGameObject(gameObject)
    return this
  }

  private _addGameObject(gameObject: GameObject) {
    World.addBody(this._engine.world, gameObject.body)
    this._gameObjects.push(gameObject)
    if (!gameObject.body.isStatic) this._liveObjects.push(gameObject)

    if (this._render != null && gameObject.graphics != null) {
      this._render.addChild(gameObject.graphics)
    }
  }

  //
  // Events
  //
  private _onsensorTrigger: SensorTriggerHandler = ({ triggered }) => {
    triggered.addText('ffj')
  }
}
