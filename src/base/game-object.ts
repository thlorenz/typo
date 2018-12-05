import { Body } from 'matter-js'
import * as P from 'pixi.js'
import { RoleOptions } from './options'

export interface IGameObject {
  body: Body
  graphics: P.Graphics
  syncGraphics(): void
  update(): void
}

export abstract class GameObject implements IGameObject {
  private _body: Body
  private _graphics: P.Graphics
  private _role: RoleOptions

  constructor(
    body: Body,
    role = new RoleOptions(),
    graphics = new P.Graphics()) {
    this._body = body
    this._graphics = graphics
    this._role = role
  }
  get body(): Body { return this._body }
  get graphics(): P.Graphics { return this._graphics }
  get role(): RoleOptions { return this._role }

  syncGraphics() {
    const { x, y } = this._body.position
    this._graphics.position.set(x, y)
    this._graphics.rotation = this._body.angle
  }

  update() { }
}
