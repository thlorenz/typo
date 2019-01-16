import { Engine, World } from 'matter-js'
import * as P from 'pixi.js'

import { Bomb } from '../entities/bomb'
import { Player } from '../entities/player'
import Box from '../primitives/box'

import { Camera } from '../scene/camera'
import { ObjectsGame } from '../tiled/objects.game'
import { Point } from '../types/geometry'
import { GameObject } from './game-object'
import { GameObjectOptions, RoleType } from './options'

type Radians = { radians: void } & number

function centerCircle(position: Point, radius: number): Point {
  return { x: position.x + radius, y: position.y + radius }
}

function centerBox(
  position: Point,
  width: number,
  height: number,
  rotation: Radians = 0 as Radians
): Point {
  const rx = width / 2
  const ry = height / 2
  const diagRad = ry / rx as Radians
  rotation = rotation + diagRad as Radians

  const x = position.x + rx * Math.cos(rotation)
  const y = position.y + rx * Math.sin(rotation)

  return { x, y }
}

export class LevelObjects {
  roleGameObjects: Map<string, GameObject> = new Map()

  constructor(
    private _engine: Engine,
    private _objects: ObjectsGame
  ) {}

  addRoles() {
    this._addBombs()
    this._addPlayer()
    this._addTriggers()
  }

  render(renderer: P.Container, camera: Camera) {
    for (const go of this.roleGameObjects.values()) {
      // Triggers are not rendered
      if (go.graphics == null) continue

      renderer.addChild(go.graphics)
      if (go.role.type === RoleType.Player) camera.player = go as Player
    }
  }

  private _addBombs() {
    for (const b of this._objects.bombs) {
      const opts = new GameObjectOptions()
      opts.role.type = RoleType.Bomb
      opts.role.id = b.id
      const { x, y } = centerCircle(b.position, b.radius)
      const bomb = new Bomb(x, y, b.radius, opts)
      this._addRoleGameObject(b.id, bomb)
    }
  }

  private _addTriggers() {
    for (const s of this._objects.triggers) {
      const id = `trigger:${s.triggerId}`
      const opts = new GameObjectOptions()
      opts.role.type = RoleType.Trigger
      opts.role.id = id
      opts.role.triggerId = s.triggerId
      opts.body.isSensor = true
      const { x, y } = centerBox(s.position, s.width, s.height)
      const trigger = new Box(x, y, s.width, s.height, 0, opts)
      this._addRoleGameObject(id, trigger)
    }
  }

  private _addPlayer() {
    const p = this._objects.player
    if (p == null) throw new Error('No player found in objects')

    const id = 'player'
    const opts = new GameObjectOptions()
    opts.role.type = RoleType.Player
    opts.role.id = id
    const { x, y } = centerCircle(p.position, p.radius)
    const player = new Player(x, y, p.radius, opts)
    this._addRoleGameObject(id, player)
  }

  private _addRoleGameObject(id: string, gameObject: GameObject) {
    this.roleGameObjects.set(id, gameObject)
    World.addBody(this._engine.world, gameObject.body)
  }
}
