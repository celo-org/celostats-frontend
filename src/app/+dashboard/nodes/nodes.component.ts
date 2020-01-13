import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { share, combineLatest, map, first } from 'rxjs/operators';

import { AppState, getEthstatsNodesList } from 'src/app/shared/store'
import { EthstatsNode } from 'src/app/shared/store/ethstats'

interface Column {
  name: string
  icon: string
  accessor: (node: EthstatsNode) => string | number
}

interface OrderBy {
  direction: 1 | -1
  column: Column
}

@Component({
  selector: 'app-dashboard-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss']
})
export class DashboardNodesComponent implements OnInit {
  columns: Column[] = [
    {name: 'Name', icon: 'face', accessor: node => node.info?.name},
    {name: 'ID', icon: 'person', accessor: node => node.id},
    {name: 'Peers', icon: 'people', accessor: node => node.stats?.peers},
    {name: 'Pending', icon: 'hourglass_empty', accessor: node => node.pending || 0},
    {name: 'Block #', icon: 'archive', accessor: node => node.block?.number},
    {name: 'Transactions', icon: 'compare_arrows', accessor: node => node.block?.transactions.length},
    {name: 'Block Time', icon: 'timer', accessor: node => node.block?.received},
    {name: 'Latency', icon: 'timer', accessor: node => +node.stats?.latency || 0},
    {name: 'Propagation', icon: 'wifi', accessor: node => node.block?.propagation},
  ]
    .map(column => ({
      ...column,
      accessor: node => column.accessor(node) || '',
    }))
  defaultOrderBy = this.columns[1]
  firstOrderBy = this.columns[4]

  nodesList: Observable<EthstatsNode[]>
  orderBy: BehaviorSubject<OrderBy> = new BehaviorSubject({direction: -1, column: this.firstOrderBy})

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.nodesList = this.store.pipe(
      select(getEthstatsNodesList),
      combineLatest(this.orderBy),
      map(([nodes, {direction, column: {accessor}}]) =>
        nodes
          .sort((a, b) => this.defaultOrderBy.accessor(a) > this.defaultOrderBy.accessor(b) ? 1 : -1)
          .sort((a, b) => direction * (accessor(a) > accessor(b) ? 1 : -1))
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
