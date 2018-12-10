import { Bodies } from 'matter-js'
import { GameObject } from '../base/game-object'
import {
  GameObjectOptions,
  GraphicOptions
} from '../base/options'

export default class Box extends GameObject {
  private _width: number
  private _height: number

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    angle: number,
    options: GameObjectOptions = new GameObjectOptions()
  ) {
    options.body.angle = angle
    const body = Bodies.rectangle(x, y, width, height, options.body)
    super(body, options.role)

    this._width = width
    this._height = height

    this._draw(options.graphics)
  }

  private _draw(opts: GraphicOptions) {
    if (this.graphics == null) return
    this.graphics.beginFill(opts.color, opts.alpha)
    this.graphics.drawRect(0, 0, this._width, this._height)
    this.graphics.endFill()
    this.graphics.pivot.set(this._width / 2, this._height / 2)
    this.syncGraphics()
  }

  // @ts-ignore will use soon
  private _drawDebug() {
    if (this.graphics == null) return
    this.graphics.beginFill(0x000000, 0.2)
    this.graphics.drawCircle(this._width / 2, this._height / 2, 2)
    this.graphics.drawRect(this._width / 2, 0, 1, this._height / 2)
    this.graphics.endFill()
  }
}
