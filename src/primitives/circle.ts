import { Bodies } from 'matter-js'
import { GameObject } from '../base/game-object'
import {
  GameObjectOptions,
  GraphicOptions
} from '../base/options'

export default class Circle extends GameObject {
  _radius: number

  constructor(
    x: number,
    y: number,
    radius: number,
    options: GameObjectOptions = new GameObjectOptions()
  ) {
    super(
      Bodies.circle(x, y, radius, options.body),
      options.role,
      options.text
    )
    this._radius = radius
    this._draw(options.graphics)
  }

  _draw(opts: GraphicOptions) {
    if (this.graphics == null) return
    this.graphics.beginFill(opts.color, opts.alpha)
    this.graphics.drawCircle(0, 0, this._radius)
    this.graphics.endFill()
    this.syncGraphics()
  }

  _drawDebug() {
    if (this.graphics == null) return
    this.graphics.beginFill(0x000000, 0.2)
    this.graphics.drawCircle(0, 0, 2)
    this.graphics.drawRect(0, -this._radius, 2, this._radius)
    this.graphics.endFill()
  }
}
