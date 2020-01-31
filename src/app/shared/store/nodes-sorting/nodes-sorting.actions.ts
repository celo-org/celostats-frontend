import { createAction, props } from '@ngrx/store'
import { Column } from './nodes-sorting.state'

export const setColumns =   createAction('[Nodes sorting] Set columns', props<{columns: Column[]}>())
export const loadSettings = createAction('[Nodes sorting] Load settings')
export const sortNodes =    createAction('[Nodes sorting] Update sorting', props<{column: Column}>())
