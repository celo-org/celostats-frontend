import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core'
import { ReplaySubject } from 'rxjs'

@Component({
  selector: 'component-micro-chart',
  templateUrl: './micro-chart.component.html',
  styleUrls: ['./micro-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroChartComponent implements OnInit, OnChanges {
  @Input() data: number[]

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      if (JSON.stringify(changes.data.currentValue) === JSON.stringify(changes.data.previousValue)) {
        return
      }
    }
  }
}
