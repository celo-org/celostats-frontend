import { createAction, props } from '@ngrx/store';
import { EthstatsNode } from './ethstats.state'

export const addNodes = createAction('[Ethstats] Add nodes', props<{nodes: EthstatsNode[]}>());
