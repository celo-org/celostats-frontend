import { createAction, props } from '@ngrx/store'
import { EthstatsNode } from './ethstats.state'
import { BlockSummary } from '@celo/celostats-server/src/server/interfaces/BlockSummary'
import { ChartData } from '@celo/celostats-server/src/server/interfaces/ChartData'

export const updateNodes = createAction('[Ethstats] Update nodes', props<{ nodes: Partial<EthstatsNode>[] }>())
export const setLastBlock = createAction('[Ethstats] Set last block', props<{ block: BlockSummary }>())
export const updateCharts = createAction('[Ethstats] Update charts', props<{ charts: ChartData }>())
