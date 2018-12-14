import { EventEmitter } from 'events'
import Keyboard from 'simple-keyboard'
import { GameObject } from '../base/game-object'
import { BrowserEvent, browserEvents, KeyupEvent } from './browser-events'

function resolveTypedChar(event: KeyupEvent): string | null {
  const { key } = event
  return key == null || key.length !== 1 ? null : key
}

function isdelete(event: KeyupEvent) {
  const { key } = event
  return key === 'Backspace' || key === 'Delete'
}

export const enum KeyRacerEvent {
  TriggerResolved = 'trigger-resolved'
}

type TriggerResolvedPayload = {
  triggered: GameObject
}

export type TriggerResolvedHandler = (payload: TriggerResolvedPayload) => void
export interface KeyRacer {
  on(event: KeyRacerEvent.TriggerResolved,
    handler: TriggerResolvedHandler): this
}

export class KeyRacer extends EventEmitter {
  private _texts: string[]
  private _triggered?: GameObject
  private _text?: string
  private _hasTypo = false

  constructor(texts: string[] = []) {
    super()
    this._texts = texts
    // tslint:disable-next-line
    new Keyboard({ physicalKeyboardHighlight: true })
    browserEvents.on(BrowserEvent.Keyup, this._onkeyup)
  }

  targetTriggered(triggered: GameObject) {
    this._triggered = triggered
    const nextText = this._texts.pop()
    if (nextText == null) throw new Error('Ran out of texts :(')
    this._text = nextText
    this._triggered.addText(this._text)
  }

  private _onkeyup = (event: KeyupEvent) => {
    if (this._text == null || this._triggered == null) return
    // TODO: dramatic in you face sound + visual, maybe make this optional
    // for non-beginners
    if (this._hasTypo && !isdelete(event)) return
    const c = resolveTypedChar(event)
    if (this._text[0] === c) this._oncorrectKey()
  }

  private _oncorrectKey() {
    this._triggered!.advanceTextCaret()
    this._text = this._text!.slice(1)
    if (this._text.length === 0) {
      this.emit(KeyRacerEvent.TriggerResolved, { triggered: this._triggered })
    }
  }
}
