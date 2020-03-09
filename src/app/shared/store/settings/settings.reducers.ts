import { Action, createReducer, on } from '@ngrx/store'

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
  on(settingsActions.pinNode, (state, {node, pin}) => {
    const pinnedNodes = [...state.pinnedNodes]
      .filter(_ => _ !== node)
    if (pin) {
      pinnedNodes.push(node)
    }
    return {
      ...state,
      pinnedNodes,
    }
  }),
)

export function reducer(state: State | undefined, action: Action) {
  return settingsReducer(state, action)
}

export const select = (state: AppState) => state.settings

export const getPinnedNodes = (state: State) => state.pinnedNodes
export const isPinnedNode = (state: State, {rowId}: {rowId: string}) => state?.pinnedNodes?.includes(rowId)
