import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ViewChildren, QueryList } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { Observable, Subject, Subscription } from 'rxjs'
import { share, map, distinctUntilChanged, startWith, takeWhile, endWith } from 'rxjs/operators'

import { AppState, getNodesDataCleanData, getNodesSortingColumns, getNodesSortingSorting } from 'src/app/shared/store'
import { Column, Sorting, actions as nodesSortingActions } from 'src/app/shared/store/nodes-sorting'
import { DashboardNodesRowComponent } from './nodes-row/nodes-row.component'

@Component({
  selector: 'app-dashboard-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNodesComponent implements OnInit, OnDestroy, AfterViewInit {
  loadingRows$: Observable<unknown[]>
  nodesList$: Observable<string[]>
  columns$: Observable<Column[]>
  sorting$: Observable<Sorting>

  @ViewChildren(DashboardNodesRowComponent) private rows: QueryList<DashboardNodesRowComponent>
  private rowsChangesSubscription: Subscription
  private loadedRows$: Subject<number> = new Subject()
  private readonly loadingRows = 40

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.loadingRows$ = this.loadedRows$.pipe(
      startWith(0),
      distinctUntilChanged(),
      takeWhile(n => n < this.loadingRows),
      map(n => new Array(this.loadingRows - n).fill(null)),
      endWith([]),
    )
    this.columns$ = this.store.pipe(
      select(getNodesSortingColumns),
      share(),
    )
    this.nodesList$ = this.store.pipe(
      select(getNodesDataCleanData),
      distinctUntilChanged((a, b) => a.join('|') === b.join('|')),
      // Wait until the next animation frame is ready or 0.5s, first of both. It makes the changes smoother.
      // throttle(() => merge(
      //   interval(500),
      //   interval(0, animationFrameScheduler),
      // )),
      share(),
    )
    this.sorting$ = this.store.pipe(
      select(getNodesSortingSorting),
      share(),
    )
  }

  ngAfterViewInit() {
    this.rowsChangesSubscription = this.rows.changes
      .subscribe(() => this.loadedRows$.next(this.rows.length))

    setTimeout(() => this.loadedRows$.next(Infinity), 10 * 1000)
  }

  ngOnDestroy() {
    this.rowsChangesSubscription?.unsubscribe()
  }

  changeOrderBy(column: Column) {
    this.store.dispatch(nodesSortingActions.orderBy({column}))
  }

  variants({variants, type}: Column) {
    return [
      ...(variants || [])
        .map(variant => ` table__cell--${variant} `),
      ...(type ? [` table__cell--head-type-${type} `] : []),
    ]
      .join()
  }

  trackColumn(index: number): string {
    return String(index)
  }
}


