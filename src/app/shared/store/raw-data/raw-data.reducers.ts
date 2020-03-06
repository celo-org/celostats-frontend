import { Action, createReducer, on, createSelector, createFeatureSelector } from '@ngrx/store'

import { AppState, State } from './raw-data.state'
import * as rawDataActions from './raw-data.actions'

export const initialState: State = {
  nodes: {},
  lastBlock: null,
  charts: null,
  validatorsGroups: {},
}

const rawDataReducer = createReducer(
  initialState,
  on(rawDataActions.updateNodes, (state, {nodes}) => {
    const nodesState = {...state.nodes}
    nodes
      .forEach(node => {
        nodesState[node.id.toString()] = {
          ...nodesState[node.id.toString()],
          ...node,
          updates: (nodesState[node.id.toString()]?.updates || 0) + 1,
        }
      })
    return {
      ...state,
      nodes: nodesState,
    }
  }),
  on(rawDataActions.setLastBlock, (state, {block}) => ({
    ...state,
    lastBlock: state.lastBlock?.number > block.number
      ? state.lastBlock
      : block,
  })),
  on(rawDataActions.updateCharts, (state, {charts}) => ({
    ...state,
    charts: {
      ...charts,
      updates: +(state?.charts?.updates ?? -2) + 1,
    },
  })),
  on(rawDataActions.updateValidatorGroups, (state, {groups}) => ({
    ...state,
    validatorsGroups: groups
      .reduce((acc, group) => ({
        ...acc,
        [group.address]: group,
      }), {})
  })),
)

export function reducer(state: State | undefined, action: Action) {
  return rawDataReducer(state, action)
}

export const select = (state: AppState) => state.rawData

export const getNodes = (state: State) => state.nodes
export const getNodesList = (state: State) => Object.values(state.nodes)
export const getLastBlock = (state: State) => state.lastBlock
export const getChars = (state: State) => state.charts
export const getValidatorsGroups = (state: State) => state.validatorsGroups
