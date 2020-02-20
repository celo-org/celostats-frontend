import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store'
import { Effect } from '@ngrx/effects'

import { environment } from 'src/environments/environment'

import * as RawData from './raw-data'
import * as NodesSorting from './nodes-sorting'
import * as NodesData from './nodes-data'
import * as Settings from './settings'

export const effects: any[] = [
  RawData.Effects,
  NodesSorting.Effects,
  NodesData.Effects,
  Settings.Effects,
]

export type AppState =
  RawData.AppState &
  NodesSorting.AppState &
  NodesData.AppState &
  Settings.AppState

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : []

export const reducers: ActionReducerMap<AppState> = {
  rawData: RawData.reducer,
  nodesSorting: NodesSorting.reducer,
  nodesData: NodesData.reducer,
  settings: Settings.reducer,
}

// RawData Selectors
export const getRawDataNodes = createSelector(RawData.select, RawData.getNodes)
export const getRawDataNodesList = createSelector(RawData.select, RawData.getNodesList)
export const getRawDataLastBlock = createSelector(RawData.select, RawData.getLastBlock)
export const getRawDataCharts = createSelector(RawData.select, RawData.getChars)
export const getRawDataValidatorGroups = createSelector(RawData.select, RawData.getValidatorsGroups)

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
export const getSettingsPinnedNodes = createSelector(Settings.select, Settings.getPinnedNodes)
export const isSettingsPinnedNode = createSelector(Settings.select, Settings.isPinnedNode)

