import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { share } from 'rxjs/operators';

import { AppState, getEthstatsNodesList } from 'src/app/shared/store'

@Component({
  selector: 'app-dashboard-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss']
})
export class DashboardNodesComponent implements OnInit {
  columns = [
    {name: 'Name', icon: 'face', accessor: node => node.info?.name},
    {name: 'ID', icon: 'person', accessor: node => node.id},
    {name: 'Peers', icon: 'people', accessor: node => node.stats?.peers},
    {name: 'Pending', icon: 'hourglass_empty', accessor: node => node.pending || 0},
    {name: 'Block #', icon: 'archive', accessor: node => node.block?.number},
    {name: 'Transactions', icon: 'compare_arrows', accessor: node => node.block?.transactions.length},
    {name: 'Block Time', icon: 'timer', accessor: node => node.block?.received},
    {name: 'Latency', icon: 'timer', accessor: node => node.stats?.latency},
    {name: 'Propagation', icon: 'wifi', accessor: node => node.block?.propagation},
  ]
  nodesList = this.store.pipe(
    select(getEthstatsNodesList),
    share(),
  )

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.nodesList
      .subscribe(_ => {
        console.clear()
        console.log(_)
      })
  }

  trackNodes(index: number, node: any): string {
    return node.id
  }

  trackColumn(index: number): string {
    return String(index)
  }
}
