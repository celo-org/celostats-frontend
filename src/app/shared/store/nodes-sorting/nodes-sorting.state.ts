import { Node, State as RawDataState } from 'src/app/shared/store/raw-data'
import { color } from 'src/app/shared'
import { MicroChartValue } from 'src/app/components/micro-chart'

export type sortingDirection = -1 | 1

export interface Context {
  block: number
  node: Node
  time: number
  validatorsGroups: RawDataState['validatorsGroups']
}

type columnBasicValues = string | number | boolean
type columnValues = columnBasicValues | number[] | MicroChartValue[]
type columnType = 'icon' | 'address' | 'chart'
type columnVariants = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'address' | 'sticky' | 'pre' | 'right' | 'grow'

export interface ColumnBase {
  name: string
  icon: string
  default?: sortingDirection
  first?: sortingDirection
  type?: columnType | ((node: Node, context: Context) => columnType)
  variants?: columnVariants[],
  accessor: (node: Node, context: Context) => columnValues
  link?: (value: columnValues, context: Context) => string
  show?: (value: columnBasicValues, context: Context) => columnBasicValues
  color?: (value: columnBasicValues, context: Context) => color | null
}

export interface ColumnChart extends ColumnBase {
  type: 'chart'
  show?: (value: number, data: any) => columnBasicValues
  color?: (value: number, data: any) => color
}

export type Column = ColumnBase | ColumnChart

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
