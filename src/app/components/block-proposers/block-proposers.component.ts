import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'component-block-proposers',
  templateUrl: './block-proposers.component.html',
  styleUrls: ['./block-proposers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockProposersComponent implements OnInit {
  ngOnInit(): void {
  }

  // trackRow(i: number, bar: ChartBar): string {
  //   return bar.index ? `index(${bar.index})` : String(i)
  // }
}
