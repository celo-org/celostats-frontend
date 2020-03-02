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
type columnType = 'icon' | 'address' | 'chart'
type columnVariants = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'address' | 'sticky' | 'pre' | 'right'

export interface Column {
  name: string
  icon: string
  default?: sortingDirection
  first?: sortingDirection
  type?: columnType | ((node: Node, context: Context) => columnType)
  variants?: columnVariants[],
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
