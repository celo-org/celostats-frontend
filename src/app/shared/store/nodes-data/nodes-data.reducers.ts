import { Action, createReducer, on, createSelector, createFeatureSelector } from '@ngrx/store'

import { AppState, State } from './nodes-data.state'
import * as nodesDataActions from './nodes-data.actions'

export const initialState: State = {
  rawData: {},
  cleanDataIds: [],
}

const nodesDataReducer = createReducer(
  initialState,
  on(nodesDataActions.updateRawData, (state, {rows}) => {
    const rawData = {...state.rawData}
    rows
      .forEach(row => rawData[row.id] = row)
    return {
      ...state,
      rawData,
    }
  }),
  on(nodesDataActions.setCleanDataId, (state, {ids: cleanDataIds}) => {
    return {
      ...state,
      cleanDataIds,
    }
  }),
)

export function reducer(state: State | undefined, action: Action) {
  return nodesDataReducer(state, action)
}

export const select = (state: AppState) => state.nodesData

export const getRawData = (state: State) => state.rawData
export const getRawDataList = (state: State) => Object.values(state.rawData)
export const getCleanData = (state: State) => state.cleanDataIds
export const getDataOf = (state: State, {rowId}: {rowId: string}) => state.rawData[rowId]
