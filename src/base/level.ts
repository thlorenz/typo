import * as P from 'pixi.js'

// @ts-ignore pixi-viewport expects a global PIXI on the window
window.PIXI = P

// @ts-ignore
import decomp from 'poly-decomp'
// @ts-ignore
window.decomp = decomp

import { Bodies, Engine, Render, World } from 'matter-js'
import { TilesTerrain } from '../tiles/tiles.terrain'
import {
  BodyType,
  BoxDefinition,
  PolyDefinition,
  Tileset
} from '../tiles/tileset'
import { Point } from '../types/geometry'
import { BodyOptions } from './options'

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
  }

  init({ debug = true, render = true }) {
    if (debug) this._initDebugRender()
    if (render) this._initRender()

    if (this._app != null) {
      this._render = this._app.stage
      this._addTerrainGraphics()
    }

    this._addTerrainBodies()
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

  private _addTerrainGraphics() {
    for (const tile of this._terrain.tiles) {
      const sprite = P.Sprite.fromFrame(tile.spriteId)
      sprite.position.set(tile.position.x, tile.position.y)
      this._render!.addChild(sprite)
    }
  }

  private _addTerrainBodies() {
    const bodyOptions = new BodyOptions()
    bodyOptions.isStatic = true

    for (const tile of this._terrain.tiles) {
      const bodyDefinition = tile.bodyDefinition
      if (bodyDefinition == null) continue
      const { position } = tile

      if (bodyDefinition.bodyType === BodyType.Box) {
        this._addBoxBody(bodyDefinition as BoxDefinition, position, bodyOptions)
      } else {
        this._addPolyBody(
          bodyDefinition as PolyDefinition,
          position,
          bodyOptions)
      }
    }
  }

  private _addBoxBody(
    box: BoxDefinition,
    position: Point,
    bodyOptions: BodyOptions
  ) {
    const { x, y, width, height } = box
    // matterjs wants the rectangle center for placement
    // additionally we need to add the offset of the body from
    // the tile's upper left corner
    const cx = position.x + (width / 2) + x
    const cy = position.y + (height / 2) + y
    const body = Bodies.rectangle(cx, cy, width, height, bodyOptions)
    World.addBody(this._engine.world, body)
  }

  private _addPolyBody(
    poly: PolyDefinition,
    position: Point,
    bodyOptions: BodyOptions
  ) {
    const { y, points } = poly

    // Adjust polygon origin so that matterjs places it correctly
    // It appears that Tiled stores it slightly differently
    const xoffset = (this._terrain.tileWidth / 2)
    const yoffset = (this._terrain.tileHeight / 2) + y

    const body = Bodies.fromVertices(
      position.x + xoffset,
      position.y + yoffset,
      [points],
      bodyOptions
    )
    World.addBody(this._engine.world, body)
  }

  private _update() { }
}
