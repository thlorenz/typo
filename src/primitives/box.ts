import { IGraphicsOptions } from '../base/options'
import { GameObject } from '../base/game-object'
import { Bodies, IChamferableBodyDefinition } from 'matter-js'

export default class Box extends GameObject {
  _width: number
  _height: number

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    graphicsOptions: IGraphicsOptions,
    bodyOptions: IChamferableBodyDefinition = {}
  ) {
    super(Bodies.rectangle(x, y, width, height, bodyOptions))

    this._width = width
    this._height = height

    this._draw(graphicsOptions)
  }

  _draw(opts: IGraphicsOptions) {
    this._graphics.beginFill(opts.color, opts.alpha)
    this._graphics.drawRect(0, 0, this._width, this._height)
    this._graphics.endFill()
    this._graphics.pivot.set(this._width / 2, this._height / 2)
    this.syncGraphics()
  }

  _drawDebug() {
    this._graphics.beginFill(0x000000, 0.2)
    this._graphics.drawCircle(this._width / 2, this._height / 2, 2)
    this._graphics.drawRect(this._width / 2, 0, 1, this._height / 2)
    this._graphics.endFill()
  }
}
