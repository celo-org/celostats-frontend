import {
  ChartData,
  NodeSummary,
  BlockSummary
} from '@celo/celostats-server'

export interface RawDataCharts extends ChartData {
  updates?: number
}

export interface Node extends NodeSummary {
  block?: BlockSummary
  history?: number[]
  updates?: number
}

export interface NodesState {
  [id: string]: Node
}

export interface State {
  nodes: NodesState
  lastBlock: BlockSummary
  charts: RawDataCharts
}

export interface AppState {
  rawData: State
}
