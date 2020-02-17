import { createAction, props } from '@ngrx/store'
import { DataRow } from './nodes-data.state'

export const updateRawData =  createAction('[Nodes data] Update raw data', props<{rows: DataRow[]}>())
export const setCleanDataId = createAction('[Nodes data] Update clean data IDs', props<{ids: string[]}>())
