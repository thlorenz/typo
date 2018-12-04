import {
  GraphicOptions,
  GameObjectOptions,
} from '../base/options'
import { GameObject } from '../base/game-object'
import { Bodies } from 'matter-js'

export default class Circle extends GameObject {
  _radius: number

  constructor(
    x: number,
    y: number,
    radius: number,
    options: GameObjectOptions = new GameObjectOptions()
  ) {
    super(Bodies.circle(x, y, radius, options.body))
    this._radius = radius
    this._draw(options.graphics)
  }

  _draw(opts: GraphicOptions) {
    this._graphics.beginFill(opts.color, opts.alpha)
    this._graphics.drawCircle(0, 0, this._radius)
    this._graphics.endFill()
    this.syncGraphics()
  }

  _drawDebug() {
    this._graphics.beginFill(0x000000, 0.2)
    this._graphics.drawCircle(0, 0, 2)
    this._graphics.drawRect(0, -this._radius, 2, this._radius)
    this._graphics.endFill()
  }
}
