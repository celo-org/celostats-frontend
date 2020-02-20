import { createAction, props } from '@ngrx/store'
import { BlockSummary, ChartData } from '@celo/celostats-server'

import { Node, ValidatorGroup } from './raw-data.state'

export const updateNodes =           createAction('[RawData] Update nodes', props<{ nodes: Partial<Node>[] }>())
export const setLastBlock =          createAction('[RawData] Set last block', props<{ block: BlockSummary }>())
export const updateCharts =          createAction('[RawData] Update charts', props<{ charts: ChartData }>())
export const updateValidatorGroups = createAction('[RawData] Update validator groups', props<{ groups: ValidatorGroup[] }>())
