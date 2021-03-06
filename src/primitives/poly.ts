// @ts-ignore (adding decomp to global since matterjs needs it for polygons)
import decomp from 'poly-decomp'
// @ts-ignore
window.decomp = decomp

import {
  GameObjectOptions,
  GraphicOptions
} from '../base/options'

import { Bodies, Vector } from 'matter-js'
import { GameObject } from '../base/game-object'
import { Point } from '../types/geometry'

function pointsToVertices(points: Point[]) {
  const vertices = []
  for (const { x, y } of points) {
    const v = Vector.create(x, y)
    vertices.push(v)
  }
  return vertices
}

export default class Poly extends GameObject {
  constructor(
    x: number,
    y: number,
    points: Point[],
    options: GameObjectOptions = new GameObjectOptions()
  ) {
    const vertices = pointsToVertices(points)
    super(Bodies.fromVertices(x, y, [vertices], options.body), options.role)
    this._draw(options.graphics)
  }

  _draw(opts: GraphicOptions) {
    if (this.graphics == null) return
    this.graphics.beginFill(opts.color, opts.alpha)
    // TODO: how to draw this in pixi and set pivot correctly?
    this.graphics.endFill()
    this.syncGraphics()
  }

  _drawDebug() {
    if (this.graphics == null) return
    this.graphics.beginFill(0x000000, 0.2)
    // TODO: how to draw this in pixi and set pivot correctly?
    this.graphics.endFill()
  }
}
