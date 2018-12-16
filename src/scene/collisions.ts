import { EventEmitter } from 'events'
import { Engine, Events, IEventCollision } from 'matter-js'

import { GameObject } from '../base/game-object'
import { RoleType } from '../base/options'

import { Bomb } from '../entities/bomb'
import { Player } from '../entities/player'

import { unhandledCase } from '../util/guards'

export const enum CollisionEvent {
  SensorTrigger = 'collision:sensor-trigger',
  BombTrigger = 'collision:bomb-trigger'
}

type SensorTriggerPayload = {
  player: Player
  sensor: GameObject
  triggered: GameObject
}
export type SensorTriggerHandler = (payload: SensorTriggerPayload) => void

type BombTriggerPayload = {
  player: Player
  bomb: Bomb
}
export type BombTriggerHandler = (payload: BombTriggerPayload) => void

export interface Collisions {
  on(event: CollisionEvent.SensorTrigger, listener: SensorTriggerHandler): this
  on(event: CollisionEvent.BombTrigger, listener: BombTriggerHandler): this
}

export class Collisions extends EventEmitter {
  constructor(
    private _engine: Engine,
    private _roleGameObjects: Map<string, GameObject>
  ) {
    super()
    Events.on(this._engine, 'collisionStart', this._oncollisionStart)
  }

  private _oncollisionStart = (e: IEventCollision<Engine>) => {
    const { player, sensor, bomb } = this._processCollisionEvent(e)
    if (player == null) return
    if (sensor != null) {
      const tid = sensor.role.triggerId!
      const triggered = this._triggeredObject(tid)
      this.emit(CollisionEvent.SensorTrigger, { player, sensor, triggered })
    } else if (bomb != null) {
      this.emit(CollisionEvent.BombTrigger, { player, bomb })
    }
  }

  private _processCollisionEvent(
    e: IEventCollision<Engine>
  ): { player?: GameObject, sensor?: GameObject, bomb?: Bomb } {
    let player
    let sensor
    let bomb
    const [pair] = e.pairs
    const { bodyA, bodyB } = pair
    for (const go of [bodyA.gameObject, bodyB.gameObject]) {
      switch (go.role.type) {
        case RoleType.None:
          break
        case RoleType.Bomb:
          bomb = go as Bomb
          break
        case RoleType.Player:
          player = go
          break
        case RoleType.Trigger:
          sensor = go
          break
        default: unhandledCase(go.role.type)
      }
    }
    return { player, sensor, bomb }
  }

  private _triggeredObject(tid: string): GameObject {
    if (!this._roleGameObjects.has(tid)) {
      throw new Error(`Could not find triggered object ${tid}`)
    }
    return this._roleGameObjects.get(tid)!
  }
}
