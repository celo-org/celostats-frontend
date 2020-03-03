import { Component, OnInit, OnDestroy, Input, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'
import { pluck, map, share, shareReplay, pairwise, filter, startWith, scan, tap, first } from 'rxjs/operators'

import { AppState, getNodesDataDataOf, isSettingsPinnedNode } from 'src/app/shared/store'
import { DataRow } from 'src/app/shared/store/nodes-data'
import { Column } from 'src/app/shared/store/nodes-sorting'
import { actions as settingsActions } from 'src/app/shared/store/settings'

@Component({
  selector: 'app-dashboard-nodes-row',
  templateUrl: './nodes-row.component.html',
  styleUrls: ['./nodes-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNodesRowComponent implements OnInit, OnDestroy {
  @Input() rowId: string
  @HostBinding('class.table__row--pinned') pinned: boolean

  columns$: Observable<DataRow['columns'] & {classNames: string}[]>
  pinned$: Observable<boolean>
  private row$: Observable<DataRow>
  private changeDetectionsSubscription: Subscription
  private readonly detachAfter = 6

  get isAttached() {
    // Internal data to know if the change detector is attached
    // tslint:disable-next-line no-bitwise
    return !!((this.cdr as any)._lView[2] & 128)
  }

  constructor(private store: Store<AppState>, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.row$ = this.store.pipe(
      select(getNodesDataDataOf, {rowId: this.rowId}),
      filter(_ => !!_),
      share(),
    )
    this.columns$ = this.row$.pipe(
      pluck('columns'),
      map(columns =>
        columns
          .map(column => ({
            ...column,
            classNames: `
              table__cell
              table__cell--${column.style}
              table__cell--type-${column.type}
              ${
                (column.variants || [])
                  .map(variant => ` table__cell--${variant} `)
                  .join()
              }
            `.replace(/\s+/g, ' ').trim(),
          }))
      )
    )
    this.pinned$ = this.store.pipe(
      select(isSettingsPinnedNode, {rowId: this.rowId}),
      shareReplay(),
      tap(pinned => this.pinned = pinned),
    )

    this.checkChanges()
  }

  ngOnDestroy() {
    this.changeDetectionsSubscription?.unsubscribe()
  }

  checkChanges() {
    this.changeDetectionsSubscription = this.row$.pipe(
      map(({columns}) =>
        columns
          .map(({value, style}) => [value, style])
          .flat()
          .join('|')
      ),
      startWith(''),
      pairwise(),
      scan((updates, [a, b]) => a !== b ? 0 : updates + 1, 0),
    )
      .subscribe(updates => {
        if (!this.isAttached && !updates) {
          this.cdr.detectChanges()
          this.cdr.reattach()
        }
        if (this.isAttached && updates >= this.detachAfter) {
          this.cdr.detach()
        }
      })
  }

  goTo(url?: string) {
    if (url) {
      window.open(url, '_blank')
    }
  }

  pinNode() {
    this.store
      .pipe(
        select(isSettingsPinnedNode, {rowId: this.rowId}),
        first(),
      )
      .subscribe(pinned => {
        this.store.dispatch(settingsActions.pinNode({node: this.rowId, pin: !pinned}))
        if (!this.isAttached) {
          this.cdr.detectChanges()
        }
      })
  }

  trackColumn(index: number): string {
    return String(index)
  }
}
