import { EthstatsNode } from 'src/app/shared/store/ethstats'
import { color } from 'src/app/shared'

export interface Context {
  block: number
  node: EthstatsNode
}

export interface Column {
  name: string
  icon: string
  default?: boolean
  first?: boolean
  type?: 'icon' | 'address'
  variants?: ('xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'address' | 'sticky')[],
  accessor: (node: EthstatsNode) => string | number
  link?: (value: string | number, context: Context) => string
  show?: (value: string | number, context: Context) => string | number
  color?: (value: string | number, context: Context) => color
}

export interface State {
  columns: Column[]
  sorting: {
    direction: -1 | 1
    column: Column
  }
}

export interface AppState {
  nodesSorting: State
}

export const select = (state: AppState) => state.nodesSorting
