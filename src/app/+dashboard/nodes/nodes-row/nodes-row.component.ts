import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store'
import { Observable } from 'rxjs'
import { pluck } from 'rxjs/operators'

import { AppState, getNodesDataDataOf } from 'src/app/shared/store'
import { DataRow } from 'src/app/shared/store/nodes-data'

@Component({
  selector: 'app-dashboard-nodes-row',
  templateUrl: './nodes-row.component.html',
  styleUrls: ['./nodes-row.component.scss']
})
export class DashboardNodesRowComponent implements OnInit {
  @Input() rowId: string

  columns$: Observable<DataRow['columns']>


  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.columns$ = this.store.pipe(
      select(getNodesDataDataOf, {rowId: this.rowId}),
      pluck('columns'),
    )
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
