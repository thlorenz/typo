import { fail } from 'assert'
import { TileLayer } from './types'

export function findLayer(
  layers: TileLayer[],
  name: string
): TileLayer {
  for (const layer of layers) {
    if (layer.name === name) return layer
  }
  return fail(new Error(`Couldn't find layer ${name}`))
}
