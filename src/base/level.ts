import {
  Engine,
  Events,
  IEventCollision,
  Render
} from 'matter-js'
import * as P from 'pixi.js'

import { TileScene } from '../tiles/tile-scene'
import { unhandledCase } from '../util/guards'
import { GameObject } from './game-object'
import { RoleType } from './options'
import Scene from './scene'

export interface LevelOptions {
  viewportWidth: number
  viewportHeight: number

  renderParent?: HTMLElement
  debugRenderParent?: HTMLElement
}

export interface Level {
  init(opts: LevelInitOptions): void
  start(): void
}

interface AllLevelOptions extends LevelOptions {
  levelWidth: number
  levelHeight: number
}

interface LevelInitOptions {
  debug: boolean
  render: boolean
}

export type CollisionActors = {
  player?: GameObject
  trigger?: GameObject
}

export abstract class Level implements Level {
  private _tileScene: TileScene

  protected get scene() { return this._scene }
  protected get engine() { return this._engine }

  private _levelWidth: number
  private _levelHeight: number

  private _viewportWidth: number
  private _viewportHeight: number

  private _renderParent: HTMLElement
  // @ts-ignore will use in the future
  private _debugRenderParent: HTMLElement

  private _engine: Engine
  private _scene!: Scene

  private _debugRender: Render | null = null
  private _render: P.Application | null = null

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
  }

  init({ debug = true, render = true }) {
    if (debug) this._initDebugRender()
    if (render) this._initRender()
    const renderContainer = this._render != null ? this._render.stage : null
    this._scene =
      new Scene(this._tileScene, this._engine.world, renderContainer)
    this._populateWorld()
  }

  start() {
    if (this._debugRender != null) Render.run(this._debugRender)
    Engine.run(this._engine)
    Events.on(this.engine, 'collisionStart', e => {
      const { player, trigger } = this._processCollisionEvent(e)
      if (player == null || trigger == null) return
      const tid = trigger.role.triggerId!
      const triggeredObject = this.scene.triggeredObject(tid)
      this._triggerCode(triggeredObject)
    })
  }

  protected updateLevel(): void { }

  private _populateWorld() {
  }

  private _triggerCode(triggeredObject: GameObject) {
    triggeredObject.addText('ffj')
  }

  private _processCollisionEvent(e: IEventCollision<Engine>): CollisionActors {
    let player
    let trigger
    const [pair] = e.pairs
    const { bodyA, bodyB } = pair
    for (const go of [bodyA.gameObject, bodyB.gameObject]) {
      switch (go.role.type) {
        case RoleType.None:
        case RoleType.Bomb:
          break
        case RoleType.Player:
          player = go
          break
        case RoleType.Trigger:
          trigger = go
          break
        default: unhandledCase(go.role.type)
      }
    }
    return { player, trigger }
  }

  // @ts-ignore (will use in the future)
  private _update = () => {
    this._scene.update()
    this.updateLevel()
  }

  private _initRender() {
    this._render = new P.Application(
      this._viewportWidth,
      this._viewportHeight,
      { backgroundColor: 0x222222, transparent: true }
    )
    this._renderParent.appendChild(this._render.view)
    this._render.ticker.add(this._update)
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
}
