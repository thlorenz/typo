import { Bodies } from 'matter-js'
import * as P from 'pixi.js'

import { playerDiedImg } from '../assets/img/player.died'
import { playerNormalImg, radiusMultiplier } from '../assets/img/player.normal'
import { playerWorriedImg } from '../assets/img/player.worried'
import { GameObject } from '../base/game-object'
import { GameObjectOptions, RoleType } from '../base/options'
import { PlayerDeath } from './player.death'

export class Player extends GameObject {
  static create = (
    x: number,
    y: number,
    radius: number,
    options?: GameObjectOptions) => new Player(x, y, radius, options)

  static defaultOpts() {
    const opts = new GameObjectOptions()
    opts.role.type = RoleType.Player
    opts.role.id = 'player'
    opts.body.isStatic = false
    opts.body.friction = 0.4
    opts.body.frictionAir = 0.000001
    return opts
  }

  private _radius: number

  private _sprite: P.Sprite
  private _worriedSprite: P.Sprite
  private _diedSprite: P.Sprite

  private _dying = false

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

    this._sprite = this._initSprite(playerNormalImg)
    this._worriedSprite = this._initSprite(playerWorriedImg)
    this._diedSprite = this._initSprite(playerDiedImg)

    this._draw()
  }

  die() {
    if (this._dying || this.graphics == null) return null
    this._dying = true
    return new PlayerDeath(this)
  }

  showWorrySprite() {
    this._showSprite(this._worriedSprite)
  }

  showDiedSprite() {
    this._showSprite(this._diedSprite)
  }

  private _initSprite(img: string) {
    const sprite = P.Sprite.fromImage(img)
    sprite.width = this._radius * radiusMultiplier
    sprite.height = this._radius * radiusMultiplier
    return sprite
  }

  private _showSprite(sprite: P.Sprite) {
    if (this.graphics == null) return

    this.graphics.removeChildren()
    this.graphics.addChild(sprite)
    this.syncGraphics()
  }

  private _draw() {
    if (this.graphics == null) return
    this.graphics.addChild(this._sprite)
    this.graphics.pivot = this._getPivotPosition()
    this.syncGraphics()
  }

  private _getPivotPosition(): P.Point {
    return new P.Point(
      (this._sprite.width / 2),
      (this._sprite.height / 2)
    )
  }
}
