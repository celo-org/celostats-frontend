import { Action, createReducer, on, createSelector, createFeatureSelector } from '@ngrx/store'

import { State } from './nodes-sorting.state'
import * as nodesSortingActions from './nodes-sorting.actions'

export const initialState: State = {
  columns: [],
  sorting: undefined,
}

const nodesSortingReducer = createReducer(
  initialState,
  on(nodesSortingActions.setColumns, (state, {columns}) => {
    return {
      ...state,
      columns,
      sorting: {
        direction: -1 as -1,
        column: columns.find(_ => _.first),
      }
    }
  }),
  on(nodesSortingActions.sortNodes, (state, {column}) => {
    const direction: 1 | -1 = state.sorting.column === column ? state.sorting.direction * -1 as any : -1
    return {
      ...state,
      sorting: {
        column,
        direction,
      }
    }
  }),
)

export function reducer(state: State | undefined, action: Action) {
  return nodesSortingReducer(state, action)
}

export const getColumns = (state: State) => state.columns
export const getSorting = (state: State) => state.sorting
