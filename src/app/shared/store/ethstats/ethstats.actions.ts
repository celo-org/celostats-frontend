import { createAction, props } from '@ngrx/store';
import { EthstatsNode, EthstatsBlock } from './ethstats.state'

export const updateNodes = createAction('[Ethstats] Update nodes', props<{nodes: EthstatsNode[]}>());
export const setLastBlock = createAction('[Ethstats] Set last block', props<{block: EthstatsBlock}>());
