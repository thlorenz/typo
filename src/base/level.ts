import * as P from 'pixi.js'

// @ts-ignore pixi-viewport expects a global PIXI on the window
window.PIXI = P

// @ts-ignore
import decomp from 'poly-decomp'
// @ts-ignore
window.decomp = decomp

import { Engine, Render } from 'matter-js'
import { TilesTerrain } from '../tiled/tiles.terrain'
import { Tileset } from '../tiled/tileset'
import { LevelTerrain } from './level.terrain'

export interface LevelOptions {
  viewportWidth: number
  viewportHeight: number
  tileset: Tileset
  renderParent?: HTMLElement
  debugRenderParent?: HTMLElement
}

export abstract class Level {
  private _app: P.Application | null = null
  private _render: P.Container | null = null
  private _debugRender: Render | null = null

  private _engine: Engine
  private _levelWidth: number
  private _levelHeight: number
  private _levelTerrain: LevelTerrain

  constructor(
    private _viewportWidth: number,
    private _viewportHeight: number,
    private _terrain: TilesTerrain,
    // @ts-ignore will use in the future
    private _texts: string[],
    private _renderParent = document.body,
    // @ts-ignore will use in the future
    private _debugRenderParent = document.body
  ) {
    this._engine = Engine.create()
    this._levelWidth = this._terrain.width
    this._levelHeight = this._terrain.height
    this._levelTerrain = new LevelTerrain(this._engine, this._terrain)
  }

  init({ debug = true, render = true }) {
    if (debug) this._initDebugRender()
    if (render) this._initRender()

    if (this._app != null) {
      this._render = this._app.stage
      this._levelTerrain.renderBodies(this._render!)
    }

    this._levelTerrain.addBodies()
  }

  start() {
    if (this._debugRender != null) Render.run(this._debugRender)
    Engine.run(this._engine)
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

  private _update() { }
}
