import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects'
import { of, empty, asyncScheduler } from 'rxjs'
import { mergeMap, map, bufferTime, filter, distinct } from 'rxjs/operators'

import { EthstatsService } from '../../ethstats.service'
import * as ethstatsActions from './ethstats.actions'

@Injectable()
export class EthstatsEffects {

  listenNewNodes$ = createEffect(() => ({
    bufferWindow = 1000,
    scheduler = asyncScheduler
  } = {}) => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.ethstatsService.data().pipe(
        bufferTime(bufferWindow, scheduler),
        filter(({length}) => !!length),
        map(buffer => ethstatsActions.updateNodes({
          nodes: buffer
            .filter(({action, data}) => data && ['init', 'add', 'block', 'pending', 'stats'].includes(action))
            .map(({data}) => data)
        })),
        filter(({nodes: {length}}) => !!length),
      ),
    ),
  )
 )

  listenNewBlocks$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.ethstatsService.data().pipe(
        filter(({action}) => action === 'block'),
        distinct(_ => _.data.block.number),
        map(({data: {block}}) => ethstatsActions.setLastBlock({block})),
      ),
    ),
  ))

  constructor(private actions$: Actions, private ethstatsService: EthstatsService) {}
}
