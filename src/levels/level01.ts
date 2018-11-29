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
    const ground = new Box(
      this._levelWidth / 2, this._levelHeight - 100,
      this._levelWidth, 10,
      { color: 0xaaaaaa },
      { isStatic: true }
    )
    const box1 = new Box(215, 10, 30, 20, { color: 0xff0000 })
    this.scene.add([ ground, box1 ])
  }
}
