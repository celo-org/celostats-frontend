import { ChartData } from "@celo/celostats-server/src/server/interfaces/ChartData"
import { NodeSummary } from "@celo/celostats-server/src/server/interfaces/NodeSummary"
import { BlockSummary } from "@celo/celostats-server/src/server/interfaces/BlockSummary"

export interface EthstatsCharts extends ChartData {
  updates: number
}

export interface EthstatsBlock extends BlockSummary {
  updates: number
}

export interface EthstatsNode extends NodeSummary {
  pending?: number
  block?: EthstatsBlock
  updates: number
}

export interface NodesState {
  [id: string]: EthstatsNode
}

export interface State {
  nodes: NodesState
  lastBlock: EthstatsBlock
  charts: EthstatsCharts
}

export interface AppState {
  ethstats: State
}
