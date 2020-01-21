import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { Observable, BehaviorSubject, interval } from 'rxjs'
import { share, combineLatest, map, first, throttleTime, filter, distinctUntilChanged, delay } from 'rxjs/operators'

import { AppState, getEthstatsNodesList, getEthstatsLastBlock, getEthstatsCharts } from 'src/app/shared/store'

import { blocks, InfoBlock, Context } from './blocks'

@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  blocks$: Observable<(InfoBlock & {$raw: any, $value: any, $color: any})[][]>
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
        filter(({nodes, block, charts}) => !!nodes && !!block && !!charts),
        filter(() => document.hidden === undefined ? true : !document.hidden),
        throttleTime(200),
        map(_ => ({..._, time: Date.now()})),
        share(),
      )

    this.blocks$ = this.context$.pipe(
      map(context =>
        this.blocks
          .map(cards =>
            cards
              .map(block => ({
                ...block,
                $raw: block.accessor(context) as any,
              }))
              .map(block => ({
                ...block,
                $value: block.show(block.$raw, context),
                $color: block.color(block.$raw, context),
              }))
          )
      ),
      share(),
    )
    this.enter$ = this.context$.pipe(
      first(),
      delay(10),
      map(() => true)
    )
  }

  trackIndex(index: number): string {
    return String(index)
  }
}
