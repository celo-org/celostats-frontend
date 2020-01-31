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

export const effects: any[] = [
  Ethstats.Effects,
  NodesSorting.Effects,
]

export interface AppState {
  ethstats: Ethstats.State
  nodesSorting: NodesSorting.State,
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : []

export const reducers: ActionReducerMap<AppState> = {
  ethstats: Ethstats.reducer,
  nodesSorting: NodesSorting.reducer,
}

// Root selectors
export const selectEthstats = (state: AppState) => state.ethstats
export const selectNodesSorting = (state: AppState) => state.nodesSorting

// Ethstats Selectors
export const getEthstatsNodes = createSelector(selectEthstats, Ethstats.getNodes)
export const getEthstatsNodesList = createSelector(selectEthstats, Ethstats.getNodesList)
export const getEthstatsLastBlock = createSelector(selectEthstats, Ethstats.getLastBlock)
export const getEthstatsCharts = createSelector(selectEthstats, Ethstats.getChars)

// Nodes (sorting)
export const getNodesSortingColumns = createSelector(selectNodesSorting, NodesSorting.getColumns)
export const getNodesSortingSorting = createSelector(selectNodesSorting, NodesSorting.getSorting)

