
import {
  Engine,
  Render,
  World
} from 'matter-js'
import * as P from 'pixi.js'

import { Bomb } from '../entities/bomb'
import { BombExplosionEvent } from '../entities/bomb.explosion'
import { Player } from '../entities/player'

import { TileScene } from '../tiles/tile-scene'
import { GameObject } from './game-object'

import {
  BombTriggerHandler,
  CollisionEvent,
  Collisions,
  SensorTriggerHandler
} from '../scene/collisions'

import {
  KeyRacer,
  KeyRacerEvent,
  TriggerResolvedHandler
} from '../scene/key-racer'

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
  private _keyRacer: KeyRacer

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

  constructor(tileScene: TileScene, texts: string[], {
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
    this._keyRacer = new KeyRacer(texts)
  }

  init({ debug = true, render = true }) {
    if (debug) this._initDebugRender()
    if (render) this._initRender()
    if (this._app != null) this._render = this._app.stage
    this
      ._add(this._tileScene.staticGameObjects)
      ._add(this._tileScene.dynamicGameObjects)
      ._subscribeCollisions()
      ._subscribeKeyRacer()
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
      .on(CollisionEvent.BombTrigger, this._onbombTrigger)
    return this
  }

  private _subscribeKeyRacer(): this {
    this._keyRacer
      .on(KeyRacerEvent.TriggerResolved, this._ontriggerResolved)
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

  private _disposeGameObject = (gameObject: GameObject) => {
    gameObject.dispose(this._engine.world)
    const liveIdx = this._liveObjects.indexOf(gameObject)
    const gameIdx = this._gameObjects.indexOf(gameObject)
    if (liveIdx > -1) this._liveObjects.splice(liveIdx, 1)
    if (gameIdx > -1) this._gameObjects.splice(gameIdx, 1)
  }

  private _bombDeath(bomb: Bomb, player: Player) {
    const dyingPlayer = player.die()
    const explosion = bomb.explode()
    if (explosion == null) return
    explosion
      .on(BombExplosionEvent.Exploded, this._disposeGameObject)

    if (dyingPlayer != null) {
      explosion
        .on(BombExplosionEvent.Ticking, dyingPlayer.worrying)
        .on(BombExplosionEvent.Exploding, dyingPlayer.dying)
        .on(BombExplosionEvent.Exploded, dyingPlayer.dead)
    }

    explosion.start()
  }

  //
  // Events
  //
  private _onsensorTrigger: SensorTriggerHandler = ({ triggered }) => {
    this._keyRacer.targetTriggered(triggered)
  }

  private _onbombTrigger: BombTriggerHandler = ({ bomb, player }) => {
    this._bombDeath(bomb, player)
  }

  private _ontriggerResolved: TriggerResolvedHandler = ({ triggered }) => {
    this._disposeGameObject(triggered)
  }
}
