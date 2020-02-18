import { Action, createReducer, on, createSelector, createFeatureSelector } from '@ngrx/store'

import { AppState, EthstatsNode, NodesState, State } from './ethstats.state'
import * as ethstatsActions from './ethstats.actions'
import { BlockStats } from "@celo/celostats-server/src/server/interfaces/BlockStats"

export const initialState: State = {
  nodes: {},
  lastBlock: null,
  charts: null,
}

const ethstatsReducer = createReducer(
  initialState,
  on(ethstatsActions.updateNodes, (state: State, {nodes}) => {
    const nodesState: NodesState = {...state.nodes}
    console.log(nodes)
    nodes
      .forEach((node: EthstatsNode) => {
        nodesState[node.id.toString()] = {
          ...node,
          updates: (nodesState[node.id.toString()]?.updates || 0) + 1
        }
      })
    return {
      ...state,
      nodes: nodesState,
    }
  }),
  on(ethstatsActions.updateBlocks, (state: State, {blocks}) => {
    const nodesState: NodesState = {...state.nodes}
    console.log(blocks)
    blocks
      .forEach((block: BlockStats) => {
        if (nodesState[block.id.toString()]) {
          nodesState[block.id.toString()].block = block.block;
          nodesState[block.id.toString()].updates = 1
        }
      })
    return {
      ...state,
      nodes: nodesState,
    }
  }),
  on(ethstatsActions.updatePending, (state: State, {pending}) => {
    const nodesState: NodesState = {...state.nodes}
    if (nodesState[pending.id.toString()]) {
      nodesState[pending.id.toString()].pending = pending.pending;
      nodesState[pending.id.toString()].updates = 1
    }
    return {
      ...state,
      nodes: nodesState,
    }
  }),
  on(ethstatsActions.setLastBlock, (state: State, {block}) => ({
    ...state,
    lastBlock: state.lastBlock?.number > block.number
      ? state.lastBlock
      : block,
  })),
  on(ethstatsActions.updateCharts, (state: State, {charts}) => ({
    ...state,
    charts: {
      ...charts,
      updates: +(state?.charts?.updates ?? 0) + 1,
    },
  })),
)

export function reducer(state: State | undefined, action: Action) {
  return ethstatsReducer(state, action)
}

export const select = (state: AppState) => state.ethstats

export const getNodes = (state: State) => state.nodes
export const getNodesList = (state: State) => Object.values(state.nodes)
export const getLastBlock = (state: State) => state.lastBlock
export const getChars = (state: State) => state.charts
