import { Action, createReducer, on, createSelector, createFeatureSelector } from '@ngrx/store'

import { State } from './nodes-data.state'
import * as nodesDataActions from './nodes-data.actions'

export const initialState: State = {
  rawData: {},
  cleanData: [],
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
  on(nodesDataActions.setCleanData, (state, {rows: cleanData}) => {
    return {
      ...state,
      cleanData,
    }
  }),
)

export function reducer(state: State | undefined, action: Action) {
  return nodesDataReducer(state, action)
}

export const getRawData = (state: State) => state.rawData
export const getCleanData = (state: State) => state.cleanData
