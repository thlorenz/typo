import delay from 'delay'
import { EventEmitter } from 'events'
import { Howl } from 'howler'

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

    // Wait until explosion sound plays out and consider explosion complete
    await delay(2000)
    this.emit(BombExplosionEvent.Exploded, this._bomb)
  }
}
