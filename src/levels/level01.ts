import { Events, World } from 'matter-js'
import { ILevelOptions, Level } from '../base/level'
import { ITileLayer, TileScene } from '../tiles/tile-scene'
import { unhandledCase } from '../util/guards'

import * as tiled from '../../design/level01/static.layer.tiled.json'
import { RoleType } from '../base/options'
import { IGameObject } from '../base/game-object';

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
    Events.on(this.engine, 'collisionStart', e => {
      const [ pair ] = e.pairs
      const { bodyA, bodyB } = pair
      let player: IGameObject | null = null
      let trigger: IGameObject | null = null
      for (const go of [ bodyA.gameObject, bodyB.gameObject ]) {
        switch (go.role.type) {
          case RoleType.None:
          case RoleType.Bomb:
            break
          case RoleType.Player:
            player = go
            break
          case RoleType.Trigger:
            trigger = go
            break
          default: unhandledCase(go.role.type)
        }
      }
      if (player == null || trigger == null) return
      console.log({ player, trigger })
    }
  })
  // this.scene.add([ ground, box1, circ1, circ2 ])
}

}
