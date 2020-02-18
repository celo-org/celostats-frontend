import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects'
import { of, empty, asyncScheduler } from 'rxjs'
import { mergeMap, map, bufferTime, filter, distinct } from 'rxjs/operators'

import { EthstatsService } from 'src/app/shared/ethstats.service'
import * as ethstatsActions from './ethstats.actions'
import { EthstatsBlock, EthstatsCharts, EthstatsNode } from "./ethstats.state"
import { BlockStats } from "@celo/celostats-server/src/server/interfaces/BlockStats"
import { StatsResponse } from "@celo/celostats-server/src/server/interfaces/StatsResponse"
import { Pending } from "@celo/celostats-server/src/server/interfaces/Pending"

@Injectable()
export class EthstatsEffects {

  listenNewNodes$ = createEffect(() => (
    {
      bufferWindow = 50,
      scheduler = asyncScheduler
    } = {}) => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.ethstatsService.data<EthstatsNode>().pipe(
        bufferTime(bufferWindow, scheduler),
        filter(({length}) => !!length),
        map((buffer) => ethstatsActions.updateNodes({
          nodes: buffer
            // not sure if we should separate this
            .filter(({action, data}) => data && action === 'init' || action === 'add')
            .map(({data}) => data)
        })),
        filter(({nodes: {length}}) => !!length),
      ),
    ),
    )
  )

  listenNewBlock$ = createEffect(() => (
    {
      bufferWindow = 50,
      scheduler = asyncScheduler
    } = {}) => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.ethstatsService.data<BlockStats>().pipe(
        bufferTime(bufferWindow, scheduler),
        filter(({length}) => !!length),
        map((buffer) => ethstatsActions.updateBlocks({
          blocks: buffer
            // not sure if we should separate this
            .filter(({action, data}) => !!data && action === 'block')
            .map(({data}) => data)
        })),
        filter(({blocks: {length}}) => !!length),
      ),
    ),
    )
  )

  listenStats$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.ethstatsService.data<StatsResponse>().pipe(
        filter(({action}) => action === 'stats'),
        map((buffer) => buffer.data as StatsResponse),
        map((stats: StatsResponse) => ethstatsActions.updateStats({
          stats: stats.stats
        })),
      ),
    ))
  )

  listenPending$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.ethstatsService.data<Pending>().pipe(
        filter(({action}) => action === 'pending'),
        map((buffer) => buffer.data as Pending),
        map((pending: Pending) => ethstatsActions.updatePending({
          pending
        })),
      ),
    ))
  )

  listenNewBlocks$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.ethstatsService.data<EthstatsBlock>().pipe(
        filter(({action}) => (action) === 'block'),
        map((buffer) => buffer.data as EthstatsBlock),
        distinct((block) => block.number),
        map((block: EthstatsBlock) => ethstatsActions.setLastBlock({block})),
      ),
    ),
  ))

  listenChartsUpdates$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mergeMap(() =>
      this.ethstatsService.data<EthstatsCharts>().pipe(
        filter(({action}) => action === 'charts'),
        map((buffer) => buffer.data as EthstatsCharts),
        map((charts: EthstatsCharts) => ethstatsActions.updateCharts({charts}))
      ),
    ),
  ))

  constructor(private actions$: Actions, private ethstatsService: EthstatsService) {
  }
}
