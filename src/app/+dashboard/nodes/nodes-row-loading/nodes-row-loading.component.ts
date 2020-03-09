import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { AppState, getNodesSortingColumns } from 'src/app/shared/store'
import { Column } from 'src/app/shared/store/nodes-sorting'

@Component({
  selector: 'app-dashboard-nodes-row-loading',
  templateUrl: './nodes-row-loading.component.html',
  styleUrls: ['./nodes-row-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNodesRowLoadingComponent implements OnInit {
  columns$: Observable<Column[] & {classNames: string}[]>

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.columns$ = this.store.pipe(
      select(getNodesSortingColumns),
      map(columns =>
        columns
          .map(column => ({
            ...column,
            classNames: `
              table__cell
              table__cell--type-${column.type}
              ${
                (column.variants || [])
                  .map(variant => ` table__cell--${variant} `)
                  .join()
              }
            `.replace(/\s+/g, ' ').trim(),
          }))
      ),
    )
  }

  trackColumn(index: number): string {
    return String(index)
  }
}
