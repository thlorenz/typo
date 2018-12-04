import { World } from 'matter-js'
import { ILevelOptions, Level } from '../base/level'
import { ITileLayer, TileScene} from '../tiles/tile-scene'

import * as tiled from '../../design/level01/static.layer.tiled.json'

export default class Level01 extends Level {
  constructor({
    viewportWidth,
    viewportHeight,
    renderParent = document.body,
    debugRenderParent = document.body
  }: ILevelOptions) {
    super({
      levelWidth: 1000,
      levelHeight: 780,
      viewportWidth,
      viewportHeight,
      renderParent,
      debugRenderParent
    })
  }

  populateWorld() {
    const objectLayer = tiled.layers.find(x => x.type === 'objectgroup')
    if (objectLayer == null) throw new Error('No object layer found in tilemap')
    const tileScene = new TileScene(objectLayer as ITileLayer)
    const staticBodies = tileScene.staticGameObjects.map(x => x.body)
    const dynamicBodies = tileScene.dynamicGameObjects.map(x => x.body)
    World.add(this.scene._world, [ ...staticBodies, ...dynamicBodies ])
    // this.scene.add([ ground, box1, circ1, circ2 ])
  }
}
