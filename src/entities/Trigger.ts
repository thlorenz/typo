import { GameObjectOptions, RoleType } from '../base/options'
import Box from '../primitives/box'

export class Trigger extends Box {
  static defaultOpts() {
    const opts = new GameObjectOptions()
    opts.role.type = RoleType.Trigger
    opts.body.isSensor = true
    return opts
  }
}
