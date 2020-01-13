import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store'
import { Effect } from '@ngrx/effects'

import { environment } from '../../../environments/environment'

import * as Ethstats from './ethstats'

export const effects: any[] = [
  Ethstats.Effects,
]

export interface AppState {
  ethstats: Ethstats.State
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : []

export const reducers: ActionReducerMap<AppState> = {
  ethstats: Ethstats.reducer,
}

// Root selectors
export const selectEthstats = (state: AppState) => state.ethstats

// Ethstats Selectors
export const getEthstatsNodes = createSelector(selectEthstats, Ethstats.getNodes)
export const getEthstatsNodesList = createSelector(selectEthstats, Ethstats.getNodesList)
export const getEthstatsLastBlock = createSelector(selectEthstats, Ethstats.getLastBlock)
