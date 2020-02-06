import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'
import { pluck, map, share, pairwise, filter, startWith, scan, tap } from 'rxjs/operators'

import { AppState, getNodesDataDataOf } from 'src/app/shared/store'
import { DataRow } from 'src/app/shared/store/nodes-data'
import { Column } from 'src/app/shared/store/nodes-sorting'

@Component({
  selector: 'app-dashboard-nodes-row',
  templateUrl: './nodes-row.component.html',
  styleUrls: ['./nodes-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNodesRowComponent implements OnInit, OnDestroy {
  @Input() rowId: string

  columns$: Observable<DataRow['columns'] & {classNames: string}[]>
  private row$: Observable<DataRow>
  private changeDetectionsSubscription: Subscription
  private readonly detachAfter = 6

  constructor(private store: Store<AppState>, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.row$ = this.store.pipe(
      select(getNodesDataDataOf, {rowId: this.rowId}),
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
              ${this.variants(column.variants)}
            `.replace(/\s+/g, ' ').trim(),
          }))
      )
    )

    this.checkChanges()
  }

  ngOnDestroy() {
    this.changeDetectionsSubscription.unsubscribe()
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
        // Internal data to know if the change detector is attached
        const isAttached = !!((this.cdr as any)._lView[2] & 128)

        if (!isAttached && !updates) {
          this.cdr.detectChanges()
          this.cdr.reattach()
        }
        if (isAttached && updates >= this.detachAfter) {
          this.cdr.detach()
        }
      })
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
