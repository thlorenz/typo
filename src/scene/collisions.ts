import { EventEmitter } from 'events'
import { Engine, Events, IEventCollision } from 'matter-js'
import { GameObject } from '../base/game-object'
import { RoleType } from '../base/options'
import { unhandledCase } from '../util/guards'

export const enum CollisionEvent {
  SensorTrigger = 'collision:sensor-trigger'
}

type SensorTriggerPayload = {
  player: GameObject
  sensor: GameObject
  triggered: GameObject
}

export type SensorTriggerHandler = (payload: SensorTriggerPayload) => void

export interface Collisions {
  on(event: CollisionEvent, listener: SensorTriggerHandler): this
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
    const { player, sensor } = this._processCollisionEvent(e)
    if (player == null || sensor == null) return
    const tid = sensor.role.triggerId!
    const triggered = this._triggeredObject(tid)
    this._handleTrigger({ player, sensor, triggered })
  }

  private _processCollisionEvent(
    e: IEventCollision<Engine>
  ): { player?: GameObject, sensor?: GameObject } {
    let player
    let sensor
    const [pair] = e.pairs
    const { bodyA, bodyB } = pair
    for (const go of [bodyA.gameObject, bodyB.gameObject]) {
      switch (go.role.type) {
        case RoleType.None:
        case RoleType.Bomb:
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
    return { player, sensor }
  }

  private _triggeredObject(tid: string): GameObject {
    if (!this._roleGameObjects.has(tid)) {
      throw new Error(`Could not find triggered object ${tid}`)
    }
    return this._roleGameObjects.get(tid)!
  }

  private _handleTrigger(payload: SensorTriggerPayload) {
    this.emit(CollisionEvent.SensorTrigger, payload)
  }
}
