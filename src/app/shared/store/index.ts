import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store'
import { Effect } from '@ngrx/effects'

import { environment } from 'src/environments/environment'

import * as Ethstats from './ethstats'
import * as NodesSorting from './nodes-sorting'
import * as NodesData from './nodes-data'

export const effects: any[] = [
  Ethstats.Effects,
  NodesSorting.Effects,
  NodesData.Effects,
]

export interface AppState {
  ethstats: Ethstats.State
  nodesSorting: NodesSorting.State,
  nodesData: NodesData.State,
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : []

export const reducers: ActionReducerMap<AppState> = {
  ethstats: Ethstats.reducer,
  nodesSorting: NodesSorting.reducer,
  nodesData: NodesData.reducer,
}

// Root selectors
export const selectEthstats = (state: AppState) => state.ethstats
export const selectNodesSorting = (state: AppState) => state.nodesSorting
export const selectNodesData = (state: AppState) => state.nodesData

// Ethstats Selectors
export const getEthstatsNodes = createSelector(selectEthstats, Ethstats.getNodes)
export const getEthstatsNodesList = createSelector(selectEthstats, Ethstats.getNodesList)
export const getEthstatsLastBlock = createSelector(selectEthstats, Ethstats.getLastBlock)
export const getEthstatsCharts = createSelector(selectEthstats, Ethstats.getChars)

// Nodes (sorting)
export const getNodesSortingColumns = createSelector(selectNodesSorting, NodesSorting.getColumns)
export const getNodesSortingSorting = createSelector(selectNodesSorting, NodesSorting.getSorting)

// Nodes (data)
export const getNodesDataRawData = createSelector(selectNodesData, NodesData.getRawData)
export const getNodesDataCleanData = createSelector(selectNodesData, NodesData.getCleanData)

