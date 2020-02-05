import { EthstatsNode } from 'src/app/shared/store/ethstats'
import { color } from 'src/app/shared'

export type sortingDirection = -1 | 1

export interface Context {
  block: number
  node: EthstatsNode
  time: number
}

export interface Column {
  name: string
  icon: string
  default?: sortingDirection
  first?: sortingDirection
  type?: 'icon' | 'address'
  variants?: ('xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'address' | 'sticky')[],
  accessor: (node: EthstatsNode, context: Context) => string | number
  link?: (value: string | number, context: Context) => string
  show?: (value: string | number, context: Context) => string | number
  color?: (value: string | number, context: Context) => color
}

export interface Sorting {
  direction: sortingDirection
  column: Column
}

export interface State {
  columns: Column[]
  sorting: Sorting
  default: Sorting
}

export interface AppState {
  nodesSorting: State
}
