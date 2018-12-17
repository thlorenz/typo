import { EventEmitter } from 'events'

export const enum  BrowserEvent {
  Keyup = 'window:keyup'
}

export type KeyupEvent = {
  event: KeyboardEvent
  key: string
  code: string
  shiftKey: boolean
}

export interface BrowserEvents {
  on(event: BrowserEvent.Keyup, listener: (payload: KeyupEvent) => void): this
  removeAllListeners(event: BrowserEvent.Keyup): this
}

export class BrowserEvents extends EventEmitter {
  constructor() {
    super()
    window.addEventListener('keyup', this._onwindowKeyup)
  }

  _onwindowKeyup = (e: KeyboardEvent) => {
    this.emit(
      BrowserEvent.Keyup,
      { event: e, key: e.key, code: e.code, shiftKey: e.shiftKey }
    )
  }
}

export const browserEvents = new BrowserEvents()
