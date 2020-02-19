import { createAction, props } from '@ngrx/store'
import { EthstatsNode } from './ethstats.state'
import {
  BlockSummary,
  ChartData
} from '@celo/celostats-server/src/server/interfaces'

export const updateNodes = createAction('[Ethstats] Update nodes', props<{ nodes: Partial<EthstatsNode>[] }>())
export const setLastBlock = createAction('[Ethstats] Set last block', props<{ block: BlockSummary }>())
export const updateCharts = createAction('[Ethstats] Update charts', props<{ charts: ChartData }>())
