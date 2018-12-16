import { playerDiedFx } from '../assets/fx/player-died'
import { Player } from './player'

import { Howl } from 'howler'

export class PlayerDeath {
  static diedFx = new Howl({ src: playerDiedFx })

  constructor(private _player: Player) {}

  worrying = () => {
    this._player.showWorrySprite()
  }

  dying = () => {
    this._player.showDiedSprite()
  }

  dead = () => {
    PlayerDeath.diedFx.play()
  }
}
