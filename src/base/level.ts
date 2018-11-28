import * as P from 'pixi.js'
import {
  Engine,
  Render
} from 'matter-js'

import Scene from './scene'

export interface ILevelOptions {
  viewportWidth: number
  viewportHeight: number

  renderParent?: HTMLElement
  debugRenderParent?: HTMLElement
}

export interface ILevel {
  init(opts: ILevelInitOptions): void
  start(): void
}

interface IAllLevelOptions extends ILevelOptions {
  levelWidth: number
  levelHeight: number
}

interface ILevelInitOptions {
  debug: boolean
  render: boolean
}

export abstract class Level implements ILevel {
  _levelWidth: number
  _levelHeight: number

  _viewportWidth: number
  _viewportHeight: number

  _renderParent: HTMLElement
  _debugRenderParent: HTMLElement

  _engine: Engine
  _scene!: Scene

  _debugRender: Render | null = null
  _render: P.Application | null = null

  _lastTick: number = 0

  protected get scene() { return this._scene }

  constructor({
    levelWidth,
    levelHeight,
    viewportWidth,
    viewportHeight,
    renderParent = document.body,
    debugRenderParent = document.body
  }: IAllLevelOptions) {
    this._levelWidth = levelWidth
    this._levelHeight = levelHeight
    this._viewportWidth = viewportWidth
    this._viewportHeight = viewportHeight
    this._renderParent = renderParent
    this._debugRenderParent = debugRenderParent

    this._bind()

    this._engine = Engine.create()
  }

  _bind() {
    this._tick = this._tick.bind(this)
  }

  init({ debug = true, render = true }) {
    if (debug) this._initDebugRender()
    if (render) this._initRender()
    const renderContainer = this._render != null ? this._render.stage : null
    this._scene = new Scene(this._engine.world, renderContainer)
    this.populateWorld()
  }

  start() {
    if (this._debugRender != null) Render.run(this._debugRender)
    if (this._render != null) {
      this._render.ticker.add(this._tick)
    } else {
      this._tick()
    }
  }

  _tick() {
    const now = Date.now()
    const deltaTime = this._lastTick === 0 ? 0 : now - this._lastTick
    this._lastTick = now
    this._update(deltaTime)
    if (this._render == null) requestAnimationFrame(this._tick)
  }

  _update(deltaTime: number): void {
    Engine.update(this._engine, deltaTime)
    this._scene.update()
    this.updateLevel()
  }

  protected abstract populateWorld(): void
  protected updateLevel(): void { }

  _initRender() {
    this._render = new P.Application(
      this._viewportWidth,
      this._viewportHeight,
      { backgroundColor: 0x222222, transparent: true  }
    )
    this._renderParent.appendChild(this._render.view)
  }

  _initDebugRender() {
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
