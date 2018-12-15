import { Bodies } from 'matter-js'
import * as P from 'pixi.js'
import { bombDataUrl, radiusMultiplier } from '../assets/data.bomb'
import { bombExplosionDataUrl } from '../assets/data.bomb-explosion'
import { GameObject } from '../base/game-object'
import { GameObjectOptions} from '../base/options'

export class Bomb extends GameObject {
  private _radius: number
  private _sprite: P.Sprite
  private _explosionSprite: P.Sprite

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

    // TODO: use sprite sheet
    // http://pixijs.download/dev/docs/PIXI.Sprite.html
    this._sprite = P.Sprite.fromImage(bombDataUrl)
    this._sprite.width = this._radius * radiusMultiplier
    this._sprite.height = this._radius * radiusMultiplier

    this._explosionSprite = P.Sprite.fromImage(bombExplosionDataUrl)
    this._explosionSprite.width = this._radius * radiusMultiplier
    this._explosionSprite.height = this._radius * radiusMultiplier
    this._draw()
  }

  _draw() {
    if (this.graphics == null) return
    this.graphics.addChild(this._sprite)
    this.graphics.pivot = this._getPivotPosition()
    this.syncGraphics()
  }

  handlePlayerCollision() {
    if (this.graphics == null) return
    this.graphics.removeChild(this._sprite)
    this.graphics.addChild(this._explosionSprite)
    this.syncGraphics()
  }

  private _getPivotPosition(): P.Point {
    return new P.Point(
       (this._sprite.width / 2 * 0.7),
       (this._sprite.height / 2 * 1.3)
    )
  }
}
