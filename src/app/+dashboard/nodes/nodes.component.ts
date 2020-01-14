import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { share, combineLatest, map, first, throttleTime, filter, distinctUntilChanged } from 'rxjs/operators';

import { AppState, getEthstatsNodesList, getEthstatsLastBlock } from 'src/app/shared/store'
import { EthstatsNode } from 'src/app/shared/store/ethstats'
import { color, colorRange, formatNumber } from 'src/app/shared'

interface Context {
  block: number
  node: EthstatsNode
}

interface Column {
  name: string
  icon: string
  accessor: (node: EthstatsNode) => string | number
  show?: (value: string | number, context: Context) => string | number
  color?: (value: string | number, context: Context) => color
}

interface OrderBy {
  direction: 1 | -1
  column: Column
}

const columns: Column[] = [
  {name: 'Name', icon: 'face', accessor: node => node.info?.name},
  {name: 'ID', icon: 'person', accessor: node => node.id},
  {
    name: 'Peers',
    icon: 'people',
    accessor: node => node.stats?.peers || 0,
    color: value => value ? 'ok' : 'no',
  },
  {name: 'Pending', icon: 'hourglass_empty', accessor: node => node.pending || 0},
  {
    name: 'Block',
    icon: 'archive',
    accessor: node => node.block?.number,
    show: value => value ? '# ' + formatNumber(+value, 0) : 'n/a',
    color: (value, {block}) => value ? colorRange(block - +value, [, 0, 1, 2, 10]) : 'no',
  },
  {name: 'Transactions', icon: 'compare_arrows', accessor: node => node.block?.transactions.length || 0},
  {
    name: 'Block Time',
    icon: 'timer',
    accessor: node => node.block?.received ? Math.round((Date.now() - +node.block?.received) / 1000) : -Infinity,
    show: value => value !== -Infinity ? value + ' s ago' : 'n/a',
    color: value => value !== -Infinity ? colorRange(+value, [, 10, 30, 60, 600]) : 'no',
  },
  {
    name: 'Latency',
    icon: 'timer',
    accessor: node => +node.stats?.latency || 0,
    show: value => value === 0 ? `${value} ms` : value ? `+${value} ms` : '',
    color: value => colorRange(+value, [0, 10, 100, 1000, 100000]),
  },
  {name: 'Propagation', icon: 'wifi', accessor: node => node.block?.propagation},
]

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
  defaultOrderBy = columns[1]
  firstOrderBy = columns[4]

  nodesList: Observable<{value: string | number, style?: color}[][]>
  orderBy: BehaviorSubject<OrderBy> = new BehaviorSubject({direction: -1, column: this.firstOrderBy})

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.nodesList = this.store.pipe(
      throttleTime(100),
      filter(() => document.hidden === undefined ? true : !document.hidden),
      select(getEthstatsNodesList),
      combineLatest(
        this.orderBy,
        this.store.pipe(
          select(getEthstatsLastBlock),
          map(block => block?.number),
          distinctUntilChanged(),
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
