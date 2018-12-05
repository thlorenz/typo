import { IChamferableBodyDefinition } from 'matter-js'
import { unhandledCase } from '../util/guards'

const enum GameObjectType {
  Body
}

const enum RoleType {
  None,
  Bomb,
  Trigger
}

function roleTypeFromString(s: keyof typeof RoleType): RoleType {
  switch (s) {
    case 'None': return RoleType.None
    case 'Bomb': return RoleType.Bomb
    case 'Trigger': return RoleType.Trigger
    default: return unhandledCase(s)
  }
}

class GraphicOptions {
  color: number = 0xaaaaaa
  alpha: number = 1
  radius?: number
}

class BodyOptions implements IChamferableBodyDefinition {
  friction = 0.01
  frictionAir = 0.01
  frictionStatic = 0.5
  density = 0.2
  isStatic = true
  isSensor = false
}

class RoleOptions {
  type: RoleType = RoleType.None
  id: string | null = null
  triggerId: string | null = null
}

class GameObjectOptions {
  role = new RoleOptions()
  graphics: GraphicOptions = new GraphicOptions()
  body: IChamferableBodyDefinition = new BodyOptions()
  constructor(public type = GameObjectType.Body) { }
}

export {
  GraphicOptions,
  BodyOptions,
  GameObjectOptions,
  RoleType,
  roleTypeFromString,
  RoleOptions
}
