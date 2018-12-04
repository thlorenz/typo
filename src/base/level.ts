import {
  Engine,
  Render
} from 'matter-js'
import * as P from 'pixi.js'

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

  protected get scene() { return this._scene }
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

    this._engine = Engine.create()
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
    Engine.run(this._engine)
  }

  protected abstract populateWorld(): void
  protected updateLevel(): void { }

  // @ts-ignore (will use in the future)
  private _update(): void {
    this._scene.update()
    this.updateLevel()
  }

  private _initRender() {
    this._render = new P.Application(
      this._viewportWidth,
      this._viewportHeight,
      { backgroundColor: 0x222222, transparent: true  }
    )
    this._renderParent.appendChild(this._render.view)
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
