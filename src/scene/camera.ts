import Viewport from 'pixi-viewport'
import { GameObject } from '../base/game-object'
import { Player } from '../entities/player'

export class Camera {
  private _player: Player | null = null
  private _playerRadius: number
  private _triggerRadius: number

  constructor(
    private _viewport: Viewport,
    viewportWidth: number,
    viewportHeight: number
  ) {
    const dimension = Math.min(viewportWidth, viewportHeight)
    this._playerRadius = dimension / 2
    this._triggerRadius = dimension / 6
  }

  set player(val: Player) { this._player = val }

  followTriggered(triggered: GameObject) {
    if (triggered.graphics == null) return
    this._viewport.follow(triggered.graphics, {
      radius: this._triggerRadius,
      speed: 30
    })
  }

  followPlayer() {
    if (this._player == null || this._player.graphics == null) return
    this._viewport.follow(this._player.graphics, {
      radius: this._playerRadius,
      speed: 5
    })
  }

}
