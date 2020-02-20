import { createAction, props } from '@ngrx/store'
import { Node } from './raw-data.state'
import {
  BlockSummary,
  ChartData
} from '@celo/celostats-server'

export const updateNodes = createAction('[RawData] Update nodes', props<{ nodes: Partial<Node>[] }>())
export const setLastBlock = createAction('[RawData] Set last block', props<{ block: BlockSummary }>())
export const updateCharts = createAction('[RawData] Update charts', props<{ charts: ChartData }>())
