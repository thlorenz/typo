import * as P from 'pixi.js'
import { Tileset } from '../tiles/tileset';

async function maybeLoad(url: string): Promise<void> {
  // There seems to be no way to cleanly dispose all loaded resources
  // even via dispose calls.
  // Thus during hot reloading we may try to reload an already loaded resource.
  // If that was the case we can safely continue.
  return new Promise((resolve, reject) => {
    try {
      P.loader
        .add(url)
        .load(resolve)
    } catch (err) {
      if (/^Resource named .+ already exists/.test(err.message)) {
        resolve()
      } else {
        reject(err)
      }
    }
  })
}

// At this point all resources are supplied via data URIs, but
// that may change in the future in which case resources are actually
// fetched async
export class ResourceLoader {
  constructor(private _tileset: Tileset) { }

  load() {
    return Promise.all([ this._loadTileset() ])
  }

  private _loadTileset = () => {
    const url = this._tileset.spritesPackDataUri()
    return maybeLoad(url)
  }
}
