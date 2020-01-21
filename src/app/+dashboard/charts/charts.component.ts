import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { Observable, BehaviorSubject, interval } from 'rxjs'
import { share, combineLatest, map, first, throttleTime, filter, distinctUntilChanged, delay, scan, startWith, skip } from 'rxjs/operators'

import { AppState, getEthstatsNodesList, getEthstatsLastBlock, getEthstatsCharts } from 'src/app/shared/store'

import { blocks, InfoBlock, Context } from './blocks'

type infoBlockExtended = InfoBlock & {$raw: any, $value: any, $color: any}

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
          needsUpdate: (a, b) => (column as any).needsUpdate?.(a, b) === false ? false : a !== b,
          color: (value, context) => (column as any).color?.(value, context) ?? 'no',
        }))
    )
  blocks$: Observable<infoBlockExtended[][]>
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
      scan((blockList, context) =>
        blockList
          .map(cards =>
            cards
              .map(block => {
                const $raw = block.accessor(context) as any
                if (block.needsUpdate($raw, block.$raw)) {
                  return {
                    ...block,
                    $raw,
                    $value: block.show($raw, context),
                    $color: block.color($raw, context),
                  }
                }
                return block
              })
          ),
        this.blocks as infoBlockExtended[][],
      ),
      startWith(this.blocks as infoBlockExtended[][]),
      share(),
    )
    this.enter$ = this.blocks$.pipe(
      skip(1),
      first(),
      delay(10),
      map(() => true)
    )
  }

  trackIndex(index: number): string {
    return String(index)
  }
}
