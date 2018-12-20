import { Point } from '../types/geometry'

export function cellPosition(
  idx: number,
  cols: number,
  cellWidth: number,
  cellHeight: number
): Point {
  const row = Math.floor(idx / cols)
  const col = idx % cols
  const x = col * cellWidth
  const y = row * cellHeight
  return { x, y }
}
