import { Point } from '../types/geometry'
import { findLayer } from './helpers'
import { isstring, ObjectLayer, Property, TileLayer, TileObject } from './types'

class ObjectBase {
  constructor(public position: Point) { }
}

export class ObjectPlayer extends ObjectBase {
  constructor(
    public position: Point,
    public radius: number
  ) {
    super(position)
  }
}

export class ObjectTrigger extends ObjectBase {
  constructor(
    public position: Point,
    public width: number,
    public height: number,
    public triggerId: string
  ) {
    super(position)
  }
}

export class ObjectBomb extends ObjectBase {
  constructor(
    public position: Point,
    public radius: number,
    public id: string
  ) {
    super(position)
  }
}

export class ObjectsGame {

  get player() { return this._player }
  get triggers() { return this._triggers }
  get bombs() { return this._bombs }

  static findLayer(layers: TileLayer[], name: string): ObjectLayer {
    return findLayer(layers, name) as ObjectLayer
  }

  static extractProperties(props?: Property[]): Map<string, string> {
    const map = new Map()
    if (props == null || props.length === 0) return map
    for (const x of props) {
      if (!isstring(x)) throw new Error('Only string properties supported')
      map.set(x.name, x.value)
    }
    return map
  }

  private _player: ObjectPlayer | undefined
  private _triggers: ObjectTrigger[] = []
  private _bombs: ObjectBomb[] = []

  constructor(
    private _objectLayer: ObjectLayer
  ) {
    this._process()
  }

  _process() {
    for (const o of this._objectLayer.objects) {
      switch (o.type) {
        case 'Player': {
          this._addPlayer(o)
          break
        }
        case 'Trigger': {
          this._addTrigger(o)
          break
        }
        case 'Bomb': {
          this._addBomb(o)
          break
        }
      }
    }
  }

  _addPlayer(o: TileObject) {
    if (this._player != null) {
      throw new Error('Found more than one player in object layer')
    }
    this._player = new ObjectPlayer({ x: o.x, y: o.y }, o.width / 2)
  }

  _addTrigger(o: TileObject) {
    const props = ObjectsGame.extractProperties(o.properties)
    if (props.size === 0) {
      throw new Error('Trigger needs triggerId property')
    }
    if (props.size !== 1 || !props.has('triggerId')) {
      throw new Error('Expecting exactly triggerId property')
    }
    const trigger = new ObjectTrigger(
      { x: o.x, y: o.y },
      o.width,
      o.height,
      props.get('triggerId')!
    )
    this._triggers.push(trigger)
  }

  _addBomb(o: TileObject) {
    const props = ObjectsGame.extractProperties(o.properties)
    if (props.size === 0) {
      throw new Error('Bomb needs id property')
    }
    if (props.size !== 1 || !props.has('id')) {
      throw new Error('Expecting exactly id property')
    }
    const bomb = new ObjectBomb(
      { x: o.x, y: o.y },
      o.width / 2,
      props.get('id')!
    )
    this._bombs.push(bomb)
  }
}
