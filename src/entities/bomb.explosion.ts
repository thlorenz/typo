import delay from 'delay'
import { EventEmitter } from 'events'
import { Howl } from 'howler'
import * as P from 'pixi.js'
import { tween, TweenConfig, TweenEasing } from 'shifty'

import { bombExplosionFx } from '../assets/fx/bomb-explosion'
import { Bomb } from './bomb'

export const enum BombExplosionEvent {
  Ticking = 'ticking',
  Exploding = 'exploding',
  Exploded = 'exploded'
}

export interface BombExplosion {
  on(event: BombExplosionEvent, listener: (bomb: Bomb) => void): this
}

export class BombExplosion extends EventEmitter {
  static explosionFx = new Howl({ src: bombExplosionFx })

  constructor(private _bomb: Bomb) { super() }

  async start(): Promise<void> {
    BombExplosion.explosionFx.play()
    this.emit(BombExplosionEvent.Ticking, this._bomb)

    // Wait for ticks to complete before showing explosion
    await delay(1000)

    // Show exploding bomb and let sound complete playing
    this._bomb.showExplosionSprite()
    this.emit(BombExplosionEvent.Exploding, this._bomb)

    if (this._bomb.graphics != null) {
      await this._animateExplosion(this._bomb.graphics)
    }
    await delay(800)
    this.emit(BombExplosionEvent.Exploded, this._bomb)
  }

  async _animateExplosion(graphics: P.Graphics): Promise<void> {
    const tweenConfig: TweenConfig<{ scale: number, alpha: number }> = {
      from: { scale: 1, alpha: 1 },
      to: { scale: 10, alpha: 0 },
      duration: 400,
      step: state => {
        graphics.scale.x = state.scale
        graphics.scale.y = state.scale
        graphics.alpha = state.alpha
      },
      easing: TweenEasing.EaseOutExpo
    }
    return tween(tweenConfig)
  }
}
