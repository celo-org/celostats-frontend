import { ChartData } from "../../../../../../celostats-server/src/server/interfaces/ChartData"
import { NodeSummary } from "../../../../../../celostats-server/src/server/interfaces/NodeSummary"
import { BlockSummary } from "../../../../../../celostats-server/src/server/interfaces/BlockSummary"

export interface EthstatsCharts extends ChartData {
  updates: number
}

export interface EthstatsBlock extends BlockSummary {
  updates: number
}

export interface EthstatsNode extends NodeSummary {
  pending?: number
  block?: BlockSummary
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
