// @ts-ignore (adding decomp to global since matterjs needs it for polygons)
import decomp from 'poly-decomp'
// @ts-ignore
window.decomp = decomp

import {
  GameObjectOptions,
  GraphicOptions,
} from '../base/options'

import { GameObject } from '../base/game-object'
import { Bodies, Vector } from 'matter-js'
import { Point } from '../types/geometry';

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
    super(Bodies.fromVertices(x, y, [ vertices ], options.body))
    this._draw(options.graphics)
  }

  _draw(opts: GraphicOptions) {
    this._graphics.beginFill(opts.color, opts.alpha)
    // TODO: how to draw this in pixi and set pivot correctly?
    this._graphics.endFill()
    this.syncGraphics()
  }

  _drawDebug() {
    this._graphics.beginFill(0x000000, 0.2)
    // TODO: how to draw this in pixi and set pivot correctly?
    this._graphics.endFill()
  }
}
