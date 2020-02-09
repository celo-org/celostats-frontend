import { Action, createReducer, on, createSelector, createFeatureSelector } from '@ngrx/store'

import { AppState, State } from './settings.state'
import * as settingsActions from './settings.actions'

export const initialState: State = {
  pinnedNodes: [],
}

const settingsReducer = createReducer(
  initialState,
  on(settingsActions.setSettings, (state, {settings}) => {
    return {...settings}
  }),
)

export function reducer(state: State | undefined, action: Action) {
  return settingsReducer(state, action)
}

export const select = (state: AppState) => state.settings

export const getPinnesNodes = (state: State) => state.pinnedNodes
