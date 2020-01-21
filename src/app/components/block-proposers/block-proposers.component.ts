import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core'
import { ReplaySubject } from 'rxjs'

import { EthstatsMinedBlock } from 'src/app/shared/store/ethstats'

@Component({
  selector: 'component-block-proposers',
  templateUrl: './block-proposers.component.html',
  styleUrls: ['./block-proposers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockProposersComponent implements OnInit {
  @Input() data: EthstatsMinedBlock[]

  data$ = new ReplaySubject<(EthstatsMinedBlock & {blocks: boolean[]})[]>()

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    // Note: only allows positive values
    if (changes.data) {
      if (JSON.stringify(changes.data.currentValue) === JSON.stringify(changes.data.previousValue)) {
        return
      }
      const data: EthstatsMinedBlock[] = changes.data.currentValue
      const cleanData = data
        .map((mined, i, list) => ({
          ...mined,
          miner: mined.miner.replace('0x', ''),
          blocks: list
            .slice(0, 20)
            .map(({miner}) => miner === mined.miner),
        }))
        .slice(0, 8)
      this.data$.next(cleanData)
    }
  }

  trackRow(i: number, {number}: EthstatsMinedBlock): string {
    return String(number)
  }

  trackIndex(index: number): string {
    return String(index)
  }
}
