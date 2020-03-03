import {
  ChartData,
  NodeSummary,
  BlockSummary
} from '@celo/celostats-server'
import { CeloValidatorGroup } from '../../graphql'

export interface RawDataCharts extends ChartData {
  updates?: number
}

export interface Node extends NodeSummary {
  block?: BlockSummary
  history?: number[]
  signHistory?: number[]
  updates?: number
}

export type ValidatorGroup = CeloValidatorGroup

export interface State {
  nodes: {[id: string]: Node}
  lastBlock: BlockSummary
  charts: RawDataCharts
  validatorsGroups: {[address: string]: ValidatorGroup}
}

export interface AppState {
  rawData: State
}
