import { IChamferableBodyDefinition } from 'matter-js'
import * as P from 'pixi.js'
import { unhandledCase } from '../util/guards'

const enum GameObjectType {
  Body
}

const enum RoleType {
  None,
  Player,
  Bomb,
  Trigger
}

function roleTypeFromString(s: keyof typeof RoleType): RoleType {
  switch (s) {
    case 'None': return RoleType.None
    case 'Player': return RoleType.Player
    case 'Bomb': return RoleType.Bomb
    case 'Trigger': return RoleType.Trigger
    default: return unhandledCase(s)
  }
}

class GraphicOptions {
  color: number = 0x000077
  alpha: number = 1
  radius?: number

  clone(): GraphicOptions {
    const opts = new GraphicOptions()
    opts.color = this.color
    opts.alpha = this.alpha
    opts.radius = this.radius
    return opts
  }
}

class BodyOptions implements IChamferableBodyDefinition {
  friction = 0.01
  frictionAir = 0.01
  frictionStatic = 0.5
  density = 0.2
  isStatic = true
  isSensor = false

  clone(): IChamferableBodyDefinition {
    const opts = new BodyOptions()
    opts.friction = this.friction
    opts.frictionAir = this.frictionAir
    opts.frictionStatic = this.frictionStatic
    opts.density = this.density
    opts.isStatic = this.isStatic
    opts.isSensor = this.isSensor
    return opts
  }
}

class RoleOptions {
  type: RoleType = RoleType.None
  id: string | null = null
  triggerId: string | null = null

  clone(): RoleOptions {
    const opts = new RoleOptions()
    opts.id = this.id
    opts.triggerId = this.triggerId
    opts.type = this.type
    return opts
  }
}

class TextStyleOptions implements P.TextStyleOptions {
  fontFamily = 'Arial'
  fontSize = 24
  fill = 0xff1010
  align = 'center'
}

class GameObjectOptions {
  role = new RoleOptions()
  graphics: GraphicOptions = new GraphicOptions()
  body: IChamferableBodyDefinition = new BodyOptions()
  text: TextStyleOptions = new TextStyleOptions()
  constructor(public type = GameObjectType.Body) { }

  clone(): GameObjectOptions {
    const opts = new GameObjectOptions(this.type)
    opts.role = this.role.clone()
    opts.graphics = this.graphics.clone()
    opts.body = this.body.clone()
    return opts
  }
}

export {
  GraphicOptions,
  BodyOptions,
  GameObjectOptions,
  GameObjectType,
  RoleType,
  roleTypeFromString,
  RoleOptions,
  TextStyleOptions
}
