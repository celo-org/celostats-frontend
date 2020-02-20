import { Node, State as RawDataState } from 'src/app/shared/store/raw-data'
import { color } from 'src/app/shared'

export type sortingDirection = -1 | 1

export interface Context {
  block: number
  node: Node
  time: number
  validatorsGroups: RawDataState['validatorsGroups']
}

type columnValues = string | number | boolean | number[]

export interface Column {
  name: string
  icon: string
  default?: sortingDirection
  first?: sortingDirection
  type?: 'icon' | 'address' | 'chart'
  variants?: ('xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'address' | 'sticky' | 'pre')[],
  accessor: (node: Node, context: Context) => columnValues
  link?: (value: columnValues, context: Context) => string
  show?: (value: columnValues, context: Context) => columnValues
  color?: (value: columnValues, context: Context) => color
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
