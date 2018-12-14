import { Body, World } from 'matter-js'
import * as P from 'pixi.js'
import { RoleOptions, TextStyleOptions } from './options'

export abstract class GameObject {
  get body(): Body { return this._body }
  get graphics(): P.Graphics | null { return this._graphics }
  get role(): RoleOptions { return this._role }

  private _body: Body
  private _graphics: P.Graphics | null
  private _role: RoleOptions
  private _textStyle: TextStyleOptions
  private _text?: P.Text

  constructor(
    body: Body,
    role = new RoleOptions(),
    textStyle = new TextStyleOptions(),
    graphics = null) {
    this._body = body
    this._graphics = graphics
    this._role = role
    this._textStyle = textStyle
    this._body.gameObject = this

    if (this._graphics == null && !this._body.isSensor) {
      this._graphics = new P.Graphics()
    }
  }

  syncGraphics() {
    if (this._graphics == null) return
    const { x, y } = this._body.position
    this._graphics.position.set(x, y)
    this._graphics.rotation = this._body.angle
  }

  addText(text: string) {
    if (this._graphics == null) {
      throw new Error(`Attempted to add text to non-graphic ${this._role.id}`)
    }
    if (this._text != null) {
      this._graphics.removeChild(this._text)
      this._text.destroy()
    }
    this._text = new P.Text(text, this._textStyle)
    this._text.pivot = this._bodyPosition()
    this._text.position = this._bodyPosition()
    this._graphics.addChild(this._text)
  }

  advanceTextCaret() {
    if (this._text == null) return
    this._text.text = this._text.text.slice(1)
  }

  dispose(world: World) {
    World.remove(world, this._body, true)
    if (this._graphics != null) {
      this._graphics.destroy({ children: true })
      this._graphics = null
    }
  }

  update() { }

  private _bodyPosition(): P.Point {
    const { x, y } = this._body.position
    return new P.Point(x, y)
  }
}
