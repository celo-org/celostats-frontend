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
}
