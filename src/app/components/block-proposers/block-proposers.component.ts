import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core'
import { ReplaySubject } from 'rxjs'
import { Miner } from "@celo/celostats-server/src/server/interfaces/Miner"

@Component({
  selector: 'component-block-proposers',
  templateUrl: './block-proposers.component.html',
  styleUrls: ['./block-proposers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockProposersComponent implements OnChanges {
  @Input() data: Miner[]

  data$ = new ReplaySubject<(Miner & {blocks: boolean[]})[]>()

  ngOnChanges(changes: SimpleChanges) {
    // Note: only allows positive values
    if (changes.data) {
      if (JSON.stringify(changes.data.currentValue) === JSON.stringify(changes.data.previousValue)) {
        return
      }
      const data: Miner[] = changes.data.currentValue
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

  trackRow(i: number, block: Miner): string {
    return String(block.number)
  }

  trackIndex(index: number): string {
    return String(index)
  }
}
