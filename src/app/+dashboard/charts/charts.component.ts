import { Component, OnInit } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { Observable, BehaviorSubject, interval } from 'rxjs'
import { share, combineLatest, map, first, throttleTime, filter, distinctUntilChanged, delay } from 'rxjs/operators'

import { AppState, getEthstatsNodesList, getEthstatsLastBlock, getEthstatsCharts } from 'src/app/shared/store'

import { blocks, InfoBlock, Context } from './blocks'

@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class DahsboardChartsComponent implements OnInit {
  blocks: InfoBlock[][] = blocks
    .map(cards =>
      cards
        .map(column => ({
          ...column,
          accessor: node => column.accessor(node) ?? '' as any,
          show: (value, context) => (column as any).show?.(value, context) ?? value,
          color: (value, context) => (column as any).color?.(value, context) ?? 'no',
        }))
    )
  context$: Observable<Context>
  enter$: Observable<boolean>

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.context$ = interval(1000)
      .pipe(
        combineLatest(
          this.store.select(getEthstatsNodesList),
          this.store.select(getEthstatsLastBlock),
          this.store.select(getEthstatsCharts),
          (_, nodes, block, charts) => ({nodes, block, charts}),
        ),
        filter(({nodes, block}) => !!nodes && !!block),
        filter(() => document.hidden === undefined ? true : !document.hidden),
        throttleTime(200),
        map(_ => ({..._, time: Date.now()})),
        share(),
      )
    this.enter$ = this.context$.pipe(
      first(),
      delay(10),
      map(() => true)
    )
  }

  trackBlock(index: number): string {
    return String(index)
  }
}
