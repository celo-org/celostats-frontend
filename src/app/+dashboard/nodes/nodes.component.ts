import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { Observable, BehaviorSubject, interval } from 'rxjs'
import { share, combineLatest, map, first, throttleTime, filter, distinctUntilChanged } from 'rxjs/operators'

import { AppState, getEthstatsNodesList, getEthstatsLastBlock } from 'src/app/shared/store'
import { EthstatsNode } from 'src/app/shared/store/ethstats'
import { color } from 'src/app/shared'
import { Column, columns } from './columns'

interface OrderBy {
  direction: 1 | -1
  column: Column
}

@Component({
  selector: 'app-dashboard-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNodesComponent implements OnInit {
  columns: Column[] = columns
    .map(column => ({
      ...column,
      accessor: node => column.accessor(node) ?? '',
      show: (value, context) => column.show?.(value, context) ?? value,
      color: (value, context) => column.color?.(value, context) || 'ok',
    }))
  nodesList: Observable<{value: string | number, style?: color}[][]>
  orderBy: BehaviorSubject<OrderBy> = new BehaviorSubject({
    direction: -1,
    column: this.columns.find(_ => _.first),
  })
  private readonly defaultOrderBy = this.columns.find(_ => _.default)

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.nodesList = this.store.pipe(
      throttleTime(50),
      filter(() => document.hidden === undefined ? true : !document.hidden),
      select(getEthstatsNodesList),
      combineLatest(
        this.orderBy,
        this.store.pipe(
          select(getEthstatsLastBlock),
          map(block => block?.number),
          distinctUntilChanged(),
        ),
        interval(1000).pipe(
          filter(() => document.hidden === undefined ? true : !document.hidden),
        ),
      ),
      map(([nodes, {direction, column: {accessor}}, block]) =>
        nodes
          .sort((a, b) => this.defaultOrderBy.accessor(a) > this.defaultOrderBy.accessor(b) ? 1 : -1)
          .sort((a, b) => direction * (accessor(a) > accessor(b) ? 1 : -1))
          .map(node =>
            this.columns
              .map(column => ({
                ...column,
                $value: column.accessor(node),
                $context: {block, node},
              }))
              .map(column => ({
                raw: column.$value,
                value: column.show(column.$value, column.$context),
                style: column.color(column.$value, column.$context),
              }))
          )
      ),
      share(),
    )
  }

  changeOrderBy(orderBy: Column) {
    this.orderBy
      .pipe(first())
      .subscribe(({column, direction}) => {
        if (orderBy === column) {
          this.orderBy.next({column: orderBy, direction: (direction * -1) as any})
        } else {
          this.orderBy.next({column: orderBy, direction: -1})
        }
      })
  }

  trackNodes(index: number, node: any): string {
    return node.id
  }

  trackColumn(index: number): string {
    return String(index)
  }
}
