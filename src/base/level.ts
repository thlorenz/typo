import * as P from 'pixi.js'

// @ts-ignore pixi-viewport expects a global PIXI on the window
window.PIXI = P

import { TilesTerrain } from '../tiles/tiles.terrain'
import { Tileset } from '../tiles/tileset'

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

  constructor(
    private _viewportWidth: number,
    private _viewportHeight: number,
    private _terrain: TilesTerrain,
    private _texts: string[],
    private _renderParent = document.body,
    private _debugRenderParent = document.body
  ) { }

  init({ debug = true, render = true }) {
    if (render) {
      this._initRender()
    }

    if (this._app != null) {
      this._render = this._app.stage
      this._addTerrainGraphics()
    }
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

  private _addTerrainGraphics() {
    for (const tile of this._terrain.tiles) {
      const sprite = P.Sprite.fromFrame(tile.spriteId)
      sprite.position.set(tile.position.x, tile.position.y)
      this._render!.addChild(sprite)
    }
  }

  private _update() { }
}
