import {
  ChartData,
  NodeSummary,
  BlockSummary
} from '@celo/celostats-server'

export interface EthstatsCharts extends ChartData {
  updates?: number
}

export interface EthstatsNode extends NodeSummary {
  block?: BlockSummary
  history?: number[]
  updates?: number
}

export interface NodesState {
  [id: string]: EthstatsNode
}

export interface State {
  nodes: NodesState
  lastBlock: BlockSummary
  charts: EthstatsCharts
}

export interface AppState {
  ethstats: State
}
