import { Action, createReducer, on } from '@ngrx/store'

import { AppState, State, sortingDirection } from './nodes-sorting.state'
import * as nodesSortingActions from './nodes-sorting.actions'

export const initialState: State = {
  columns: [],
  sorting: undefined,
  default: undefined,
}

const nodesSortingReducer = createReducer(
  initialState,
  on(nodesSortingActions.setColumns, (state, {columns}) => {
    return {
      ...state,
      columns,
      sorting: {
        direction: columns.find(_ => _.first)?.first as sortingDirection,
        column: columns.find(_ => _.first),
      },
      default: {
        direction: columns.find(_ => _.default)?.default as sortingDirection,
        column: columns.find(_ => _.default),
      },
    }
  }),
  on(nodesSortingActions.orderBy, (state, {column}) => {
    const direction: sortingDirection = state.sorting.column === column ? state.sorting.direction * -1 as any : -1
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

export const select = (state: AppState) => state.nodesSorting

export const getColumns = (state: State) => state.columns
export const getSorting = (state: State) => state.sorting
export const getFullSorting = (state: State) => ({sorting: state.sorting, default: state.default})
