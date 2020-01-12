import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { of, empty } from 'rxjs'
import { mergeMap, map, bufferTime, filter } from 'rxjs/operators'

import { EthstatsService } from '../../ethstats.service'
import * as ethstatsActions from './ethstats.actions'

@Injectable()
export class EthstatsEffects {

  listenNewNodes$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.ethstatsService.data$.pipe(
        bufferTime(1000),
        mergeMap(buffer => {
          const nodes = []
          buffer
            .forEach(({action, data}) => {
              if (data && ["add", "block", "pending", "stats"].includes(action)) {
                nodes.push(data)
              }
            })
          return of(ethstatsActions.updateNodes({nodes}))
        }),
      ),
    ),
  ));

  listenNewBlocks$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.ethstatsService.data$.pipe(
        filter(({action}) => action === 'block'),
        map(({data: {block}}) => ethstatsActions.setLastBlock({block})),
      ),
    ),
  ))

  constructor(private actions$: Actions, private ethstatsService: EthstatsService) {}
}
