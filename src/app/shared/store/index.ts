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
import * as Settings from './settings'

export const effects: any[] = [
  Ethstats.Effects,
  NodesSorting.Effects,
  NodesData.Effects,
  Settings.Effects,
]

export type AppState =
  Ethstats.AppState &
  NodesSorting.AppState &
  NodesData.AppState &
  Settings.AppState

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : []

export const reducers: ActionReducerMap<AppState> = {
  ethstats: Ethstats.reducer,
  nodesSorting: NodesSorting.reducer,
  nodesData: NodesData.reducer,
  settings: Settings.reducer,
}

// Ethstats Selectors
export const getEthstatsNodes = createSelector(Ethstats.select, Ethstats.getNodes)
export const getEthstatsNodesList = createSelector(Ethstats.select, Ethstats.getNodesList)
export const getEthstatsLastBlock = createSelector(Ethstats.select, Ethstats.getLastBlock)
export const getEthstatsCharts = createSelector(Ethstats.select, Ethstats.getChars)

// Nodes (sorting)
export const getNodesSortingColumns = createSelector(NodesSorting.select, NodesSorting.getColumns)
export const getNodesSortingSorting = createSelector(NodesSorting.select, NodesSorting.getSorting)
export const getNodesSortingFullSorting = createSelector(NodesSorting.select, NodesSorting.getFullSorting)

// Nodes (data)
export const getNodesDataRawData = createSelector(NodesData.select, NodesData.getRawData)
export const getNodesDataRawDataList = createSelector(NodesData.select, NodesData.getRawDataList)
export const getNodesDataCleanData = createSelector(NodesData.select, NodesData.getCleanData)
export const getNodesDataDataOf = createSelector(NodesData.select, NodesData.getDataOf)

// Settings
export const getSettingsPinnedNodes = createSelector(Settings.select, Settings.getPinnesNodes)

