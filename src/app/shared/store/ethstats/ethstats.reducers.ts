import { Action, createReducer, on, createSelector, createFeatureSelector } from '@ngrx/store';

import { State } from './ethstats.state'
import * as ethstatsActions from './ethstats.actions'

export const initialState: State = {
  nodes: {},
  lastBlock: null
};

const ethstatsReducer = createReducer(
  initialState,
  on(ethstatsActions.updateNodes, (state, {nodes}) => ({
    ...state,
    nodes: {
      ...state.nodes,
      ...nodes
        .reduce((acc, node) => ({
          ...acc,
          [node.id]: {
            ...(state.nodes[node.id] || {}),
            ...node,
          },
        }), {})
    },
  })),
  on(ethstatsActions.setLastBlock, (state, {block}) => ({
    ...state,
    lastBlock: state.lastBlock?.number > block.number
      ? state.lastBlock
      : block,
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return ethstatsReducer(state, action);
}

export const getNodes = (state: State) => state.nodes
export const getNodesList = (state: State) => Object.values(state.nodes)
export const getLastBlock = (state: State) => state.lastBlock
