import { Injectable } from '@angular/core'
import { Store, select } from '@ngrx/store';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects'
import { mergeMap, filter, throttleTime, first, pairwise, startWith, tap, map, combineLatest, distinctUntilChanged } from 'rxjs/operators'

import { actions as ethstatsActions } from 'src/app/shared/store/ethstats'
import * as fromEthstats from 'src/app/shared/store/ethstats'
import * as fromNodesSorting from 'src/app/shared/store/nodes-sorting'
import * as nodesDataActions from './nodes-data.actions'

@Injectable()
export class NodesDataEffects {

  listenNewDataChanges$ = createEffect(() => this.actions$.pipe(
    ofType(ethstatsActions.updateNodes),
    throttleTime(50),
    mergeMap(() =>
      this.store.pipe(
        select(fromEthstats.select),
        select(fromEthstats.getNodes),
        first(),
      )
    ),
    startWith({} as fromEthstats.State['nodes']),
    pairwise(),
    map(([previous, current]) => {
      const updated: typeof current[''][] = []
      Object.keys(current)
        .forEach(id => {
          if (current[id].updates !== previous[id]?.updates) {
            updated.push(current[id])
          }
        })
      return updated
    }),
    combineLatest(
      this.store.pipe(
        select(fromNodesSorting.select),
        select(fromNodesSorting.getColumns),
      ),
      this.store.pipe(
        select(fromEthstats.select),
        select(fromEthstats.getLastBlock),
        map(block => block?.number),
        distinctUntilChanged(),
      ),
    ),
    map(([nodes, columns, block]) =>
      nodes
        .filter(({id}) => !!id)
        .map(node => ({
          id: node.id,
          columns: columns
            .map(column => ({
              ...column,
              $value: column.accessor(node),
              $context: {block, node},
            }))
            .map(column => ({
              raw: column.$value,
              type: column.type,
              value: column.show(column.$value, column.$context),
              style: column.color(column.$value, column.$context),
              link: column.link(column.$value, column.$context),
              variants: column.variants,
            })),
        }))
    ),
    map(rows => nodesDataActions.updateRawData({rows})),
  ))

  constructor(private actions$: Actions, private store: Store<fromEthstats.AppState & fromNodesSorting.AppState>) {}
}
