import { EthstatsNode } from 'src/app/shared/store/ethstats'
import { Column } from 'src/app/shared/store/nodes-sorting'

export interface DataValue {
  raw: ReturnType<Column['accessor']>
  value: ReturnType<Column['show']>
  type?: Column['type']
  style?: ReturnType<Column['color']>
  link?: ReturnType<Column['link']>
  variants?: Column['variants']
}

export interface DataRow {
  id: string
  columns: DataValue[]
}

export interface State {
  rawData: {[id: string]: DataRow}
  cleanData: DataRow[]
}

export interface AppState {
  nodesData: State
}

export const select = (state: AppState) => state.nodesData
