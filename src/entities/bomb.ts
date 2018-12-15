import { Bodies } from 'matter-js'
import * as P from 'pixi.js'
import { bombDataUrl, radiusMultiplier } from '../assets/data.bomb'
import { GameObject } from '../base/game-object'
import { GameObjectOptions} from '../base/options'

export class Bomb extends GameObject {
  private _radius: number
  private _sprite: P.Sprite

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
    // TODO: use sprite sheet
    // http://pixijs.download/dev/docs/PIXI.Sprite.html
    this._sprite = P.Sprite.fromImage(bombDataUrl)
    this._radius = radius
    this._draw()
  }

  _draw() {
    if (this.graphics == null) return
    this._sprite.width = this._radius * radiusMultiplier
    this._sprite.height = this._radius * radiusMultiplier
    this.graphics.addChild(this._sprite)
    this.graphics.pivot = this._getPivotPosition()
    this.syncGraphics()
  }

  private _getPivotPosition(): P.Point {
    return new P.Point(
       (this._sprite.width / 2 * 0.7),
       (this._sprite.height / 2 * 1.3)
    )
  }
}
