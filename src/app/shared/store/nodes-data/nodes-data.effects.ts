import { Injectable } from '@angular/core'
import { Store, select, Action } from '@ngrx/store'
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects'
import { interval } from 'rxjs'
import {
  mergeMap,
  filter,
  first,
  pairwise,
  startWith,
  tap,
  map,
  combineLatest,
  distinctUntilChanged,
  throttle
} from 'rxjs/operators'

import { actions as rawDataActions } from 'src/app/shared/store/raw-data'
import * as fromRawData from 'src/app/shared/store/raw-data'
import { actions as settingsActions } from 'src/app/shared/store/settings'
import * as fromSettings from 'src/app/shared/store/settings'
import { actions as nodesSortingActions } from 'src/app/shared/store/nodes-sorting'
import * as fromNodesSorting from 'src/app/shared/store/nodes-sorting'
import * as fromNodesData from './nodes-data.reducers'
import * as nodesDataActions from './nodes-data.actions'
import { AppState } from './nodes-data.state'

@Injectable()
export class NodesDataEffects {

  generateNodeRowFromUpdates$ = createEffect(() => this.actions$
    .pipe(
      ofType(rawDataActions.updateNodes),
      mergeMap(() =>
        this.store.pipe(
          select(fromRawData.select),
          select(fromRawData.getNodes),
          first(),
        )
      ),
      startWith({} as fromRawData.State['nodes']),
      combineLatest(interval(1000)),
      // Stop refreshing data if the app is in background
      filter(() => document.hidden === undefined ? true : !document.hidden),
      // If the app is not focused, the refreshing time is 1s
      throttle(() => new Promise(resolve => setTimeout(resolve, document.hasFocus() ? 50 : 1000))),
      pairwise(),
    )
    .pipe(
      map(([[previous, pInt], [current, cInt]]) => {
        const force = pInt !== cInt
        const updated: typeof current[''][] = []
        Object.keys(current)
          .forEach(id => {
            if (force || current[id].updates !== previous[id]?.updates) {
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
          select(fromRawData.select),
          select(fromRawData.getLastBlock),
          map(block => block?.number),
          distinctUntilChanged(),
        ),
        this.store.pipe(
          select(fromRawData.select),
          select(fromRawData.getValidatorsGroups),
        ),
      ),
      map(([nodes, columns, block, validatorsGroups]) => {
        const time = Date.now()
        return nodes
          .filter(({id}) => !!id)
          .map((node) => ({
            id: node.id.toString(),
            columns: columns
              .map(column => {
                const context = {block, node, time, validatorsGroups}
                const value = column.accessor(node, context)
                return {
                  raw: value,
                  type: column.type,
                  show: column.type === 'chart' ? column.show : undefined,
                  value: column.type === 'chart' ? value : column.show(value, context),
                  style: column.color(value, context),
                  link: column.link(value, context),
                  variants: column.variants,
                }
              }),
          }))
      }),
      map((rows) => nodesDataActions.updateRawData({rows})),
    ))

  cleanRowsData$ = createEffect(() => this.actions$.pipe(
    ofType(nodesDataActions.updateRawData, nodesSortingActions.orderBy, settingsActions.pinNode),
    mergeMap(() =>
      this.store.pipe(
        map(state => ({
          rawData: fromNodesData.getRawDataList(fromNodesData.select(state)),
          columns: fromNodesSorting.getColumns(fromNodesSorting.select(state)),
          sorting: fromNodesSorting.getFullSorting(fromNodesSorting.select(state)),
          pinnedNodes: fromSettings.getPinnedNodes(fromSettings.select(state)),
        })),
        filter(({rawData, columns, sorting}) => !!rawData && !!columns && !!sorting.sorting),
        first(),
      ),
    ),
    map(({rawData, columns, sorting, pinnedNodes}) => {
      const sortingFn =
        ({column, direction}: typeof sorting.sorting) => {
          const index = columns.indexOf(column)
          return ({columns: a}, {columns: b}) => {
            a = a[index].raw
            b = b[index].raw

            if (a === b) {
              return 0
            }
            if (a === null || b === null) {
              return direction * ((a === null) ? -1 : 1)
            }

            a = typeof a !== 'string' ? a : a.toLowerCase()
            b = typeof b !== 'string' ? b : b.toLowerCase()
            return direction * (a > b ? -1 : 1)
          }
        }
      return rawData
        .map(row => ({...row, pinned: pinnedNodes.includes(row.id)}))
        .sort(sortingFn(sorting.default))
        .sort(sortingFn(sorting.sorting))
        .sort(({pinned: a}, {pinned: b}) => a === b ? 0 : a ? -1 : 1)
        .map(({id}) => id)
    }),
    map(ids => nodesDataActions.setCleanDataId({ids})),
  ))

  constructor(
    private actions$: Actions,
    private store: Store<fromRawData.AppState & fromNodesSorting.AppState & fromSettings.AppState & AppState>,
  ) {}
}
