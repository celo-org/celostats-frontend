import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { Observable, BehaviorSubject, interval, of, merge, animationFrameScheduler } from 'rxjs'
import { share, map, first, filter, delay, mergeMap, distinctUntilChanged, throttle, skip } from 'rxjs/operators'

import { AppState, getNodesDataCleanData, getNodesSortingColumns, getNodesSortingSorting } from 'src/app/shared/store'
import { EthstatsNode } from 'src/app/shared/store/ethstats'
import { Column, Sorting, actions as nodesSortingActions } from 'src/app/shared/store/nodes-sorting'
import { color } from 'src/app/shared'

@Component({
  selector: 'app-dashboard-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNodesComponent implements OnInit {
  nodesList$: Observable<string[]>
  columns$: Observable<Column[]>
  enter$: Observable<boolean>
  sorting$: Observable<Sorting>

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.columns$ = this.store.pipe(
      select(getNodesSortingColumns),
      share(),
    )
    this.nodesList$ = this.store.pipe(
      select(getNodesDataCleanData),
      distinctUntilChanged((a, b) => a.join('|') === b.join('|')),
      // Wait until the next animation frame is ready or 0.5s, first of both. It makes the changes smoother.
      throttle(() => merge(
        interval(500),
        interval(0, animationFrameScheduler),
      )),
      share(),
    )
    this.sorting$ = this.store.pipe(
      select(getNodesSortingSorting),
      share(),
    )
    this.enter$ = this.nodesList$.pipe(
      mergeMap(({length}) => length > 20 ? of(undefined) : interval(3000)),
      first(),
      delay(10),
      map(() => true),
    )
  }

  changeOrderBy(column: Column) {
    this.store.dispatch(nodesSortingActions.orderBy({column}))
  }

  variants(variants: Column['variants']) {
    return (variants || [])
      .map(variant => ` table__cell--${variant} `)
      .join() as any
  }

  trackColumn(index: number): string {
    return String(index)
  }
}


