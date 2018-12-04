import { IChamferableBodyDefinition } from 'matter-js'

class GraphicOptions {
  color: number = 0xaaaaaa
  alpha: number = 1
  radius?: number
}

class BodyOptions implements IChamferableBodyDefinition {
    friction = 0.01
    frictionAir = 0.01
    density = 0.2
    isStatic = true
}

class BehaviorOptions {
  type = ''
}

class GameObjectOptions {
  behavior = new BehaviorOptions()
  graphics: GraphicOptions = new GraphicOptions()
  body: IChamferableBodyDefinition = new BodyOptions() 
}

export {
  GraphicOptions,
  BodyOptions,
  GameObjectOptions
}
