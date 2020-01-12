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


export interface State {
  ethstats: Ethstats.State
}

export const reducers: ActionReducerMap<State> = {
  ethstats: Ethstats.reducer,
}


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : []

export const effects: any[] = [
  Ethstats.Effects,
]
