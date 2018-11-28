import { Level, ILevelOptions } from '../base/level'
import Box from '../primitives/box'

export default class Level01 extends Level {
  constructor({
    viewportWidth,
    viewportHeight,
    renderParent = document.body,
    debugRenderParent = document.body
  }: ILevelOptions) {
    super({
      levelWidth: 1000,
      levelHeight: 2000,
      viewportWidth,
      viewportHeight,
      renderParent,
      debugRenderParent
    })
  }

  populateWorld() {
    const box1 = new Box(215, 10, 30, 20, { color: 0xff0000 })
    this.scene.add([ box1 ])
  }
}
