import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects'
import { asyncScheduler } from 'rxjs'
import { bufferTime, distinct, filter, map, mergeMap } from 'rxjs/operators'

import { EthstatsService } from 'src/app/shared/ethstats.service'
import * as ethstatsActions from './ethstats.actions'
import { Events } from '@celo/celostats-server/src/server/server/Events'
import { BlockSummary } from '@celo/celostats-server/src/server/interfaces/BlockSummary'
import { ChartData } from '@celo/celostats-server/src/server/interfaces/ChartData'
import { EthstatsNode } from './ethstats.state'

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
            .filter(({event, data}) =>
              data &&
              [
                Events.Init, Events.Add, Events.Block, Events.Latency,
                Events.Pending, Events.Stats, Events.Inactive
              ]
                .includes(event)
            )
            .map(({data}) => data as Partial<EthstatsNode>)
        })),
        filter(({nodes: {length}}) => !!length),
      ),
    ),
    )
  )

  listenNewBlocks$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.ethstatsService.data<'block'>().pipe(
        filter(({event}) => event === Events.Block),
        map(({data}) => data as BlockSummary),
        distinct((data) => data.number),
        map((data) => ethstatsActions.setLastBlock({block: data})),
      ),
    ),
  ))

  listenChartsUpdates$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.ethstatsService.data<'charts'>().pipe(
        filter(({event}) => event === Events.Charts),
        map(({data}) => data as ChartData),
        map((data) => ethstatsActions.updateCharts({charts: data}))
      ),
    ),
  ))

  constructor(private actions$: Actions, private ethstatsService: EthstatsService) {
  }
}
