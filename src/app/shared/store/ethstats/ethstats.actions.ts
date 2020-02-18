import { createAction, props } from '@ngrx/store'
import { EthstatsBlock, EthstatsCharts, EthstatsNode } from './ethstats.state'
import { BlockStats } from "@celo/celostats-server/src/server/interfaces/BlockStats"
import { Pending } from "@celo/celostats-server/src/server/interfaces/Pending"
import { Stats } from "@celo/celostats-server/src/server/interfaces/Stats"

export const updateNodes = createAction('[Ethstats] Update nodes', props<{ nodes: EthstatsNode[] }>())
export const updateBlocks = createAction('[Ethstats] Update nodes', props<{ blocks: BlockStats[] }>())
export const updatePending = createAction('[Ethstats] Update pending', props<{ pending: Pending }>())
export const setLastBlock = createAction('[Ethstats] Set last block', props<{ block: EthstatsBlock }>())
export const updateCharts = createAction('[Ethstats] Update charts', props<{ charts: EthstatsCharts }>())
export const updateStats = createAction('[Ethstats] Update state', props<{ stats: Stats }>())
