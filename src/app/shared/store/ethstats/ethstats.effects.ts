import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects'
import { asyncScheduler } from 'rxjs'
import { bufferTime, distinct, filter, map, mergeMap } from 'rxjs/operators'

import { EthstatsService } from 'src/app/shared/ethstats.service'
import * as ethstatsActions from './ethstats.actions'
import { Events } from '@celo/celostats-server/src/server/server/Events'

@Injectable()
export class EthstatsEffects {

  listenNewNodes$ = createEffect(() => (
    {
      bufferWindow = 50,
      scheduler = asyncScheduler
    } = {}) => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.ethstatsService.data<'node'>().pipe(
        bufferTime(bufferWindow, scheduler),
        filter(({length}) => !!length),
        map((buffer) => ethstatsActions.updateNodes({
          nodes: buffer
            .filter(({action, data}) =>
              data &&
              [Events.Init, Events.Add, Events.Block, Events.Pending, Events.Stats, Events.Inactive]
                .includes(action)
            )
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
      this.ethstatsService.data<'node'>().pipe(
        filter(({action}) => action === Events.Block),
        distinct(({data}) => data.block.number),
        map(({data: {block}}) => ethstatsActions.setLastBlock({block})),
      ),
    ),
  ))

  listenChartsUpdates$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.ethstatsService.data<'charts'>().pipe(
        filter(({action}) => action === Events.Charts),
        map(({data: charts}) => ethstatsActions.updateCharts({charts}))
      ),
    ),
  ))

  constructor(private actions$: Actions, private ethstatsService: EthstatsService) {
  }
}
