import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Miner } from '@celo/celostats-server'

import { animations } from 'src/app/shared'

@Component({
  selector: 'component-block-proposers',
  templateUrl: './block-proposers.component.html',
  styleUrls: ['./block-proposers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animations.loadingAnimation],
})
export class BlockProposersComponent implements OnChanges {
  @Input() data: Miner[]

  maxNumberOfRows = 13
  maxNumberOfBlocks = 36
  data$ = new BehaviorSubject<(Miner & {blocks: boolean[]})[]>(
    new Array(this.maxNumberOfRows)
      .fill({
        loading: true,
        number: '0'.repeat(7),
        miner: '0'.repeat(40),
        blocks: new Array(this.maxNumberOfBlocks).fill(false),
      }) as any,
  )
  private minIndexNumber // Used to keep the same index to be able to perform the initial animation

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      if (JSON.stringify(changes.data.currentValue) === JSON.stringify(changes.data.previousValue)) {
        return
      }
      const data: Miner[] = changes.data.currentValue
      if (!this.minIndexNumber) {
        this.minIndexNumber = data.reduce((acc, {number: n}) => Math.max(acc, n), 0)
      }
      const cleanData = data
        .map((mined, i, list) => ({
          ...mined,
          miner: mined.miner.replace('0x', ''),
          blocks: list
            .slice(0, this.maxNumberOfBlocks)
            .map(({miner}) => miner === mined.miner),
          track: this.maxNumberOfRows - (mined.number - this.minIndexNumber + this.maxNumberOfRows),
        }))
        .slice(0, this.maxNumberOfRows)
      this.data$.next(cleanData)
    }
  }

  trackRow(i: number, block: Miner & {loading?: boolean, track: number}): string {
    if (block.loading) {
      return String(i)
    }
    return String(block.track)
  }

  trackIndex(index: number): string {
    return String(index)
  }
}
