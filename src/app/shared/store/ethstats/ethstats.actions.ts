import { createAction, props } from '@ngrx/store'
import { EthstatsNode, EthstatsBlock, EthstatsCharts } from './ethstats.state'

export const updateNodes = createAction('[Ethstats] Update nodes', props<{nodes: Partial<EthstatsNode>[]}>())
export const setLastBlock = createAction('[Ethstats] Set last block', props<{block: EthstatsBlock}>())
export const updateCharts = createAction('[Ethstats] Update charts', props<{charts: EthstatsCharts}>())
