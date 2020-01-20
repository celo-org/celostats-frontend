import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core'
import { trigger, state, style, animate, transition } from '@angular/animations'
import { ReplaySubject } from 'rxjs'
import { first, filter, delay } from 'rxjs/operators'

export interface ChartBar {
  value: number,
  show?: number | string,
  index?: string,
  label?: string,
}
export type chartData = ChartBar[]
export type chartSizeType = 'relative' | 'absolute'


const inOutBarTime = 600
const inOutBarWidth = 4
const inOutBar = trigger('inOutBar', [
  transition(':enter', [
    style({width: 0, height: 0, margin: 0}),
    animate(`${inOutBarTime / 3}ms`, style({width: 0, height: 0, margin: 0})),
    animate(`${inOutBarTime / 3}ms`, style({width: inOutBarWidth, height: inOutBarWidth, margin: '*'})),
    animate(`${inOutBarTime / 3}ms`, style({width: '*', height: '*'})),
  ]),
  transition(':leave', [
    animate(`${inOutBarTime / 3}ms`, style({width: inOutBarWidth, height: inOutBarWidth, margin: '*'})),
    animate(`${inOutBarTime / 3}ms`, style({width: 0, height: 0, margin: 0})),
  ]),
])

@Component({
  selector: 'component-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [inOutBar],
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() data: chartData
  @Input() type: chartSizeType
  data$ = new ReplaySubject<chartData>()

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    // Note: only allows positive values
    if (changes.data) {
      // TODO: optimize that checking if it is updated on DashboardCharts component,
      // writing the content of the block on observable, not in the template
      if (JSON.stringify(changes.data.currentValue) === JSON.stringify(changes.data.previousValue)) {
        return
      }
      const data = changes.data.currentValue
      const {min, max} = data
        .map(({value}) => value)
        .reduce((acc, value) => ({
          min: Math.min(acc.min, value),
          max: Math.max(acc.max, value),
        }), {min: this.type === 'relative' ? Infinity : 0, max: 0})
      const cleanData = data
          .map(bar => ({
            ...bar,
            show: bar.show ?? bar.value,
            value: (bar.value - min) / (max - min) * 100
          }))
      this.data$.next(cleanData)
    }
  }

  trackBar(i: number, bar: ChartBar): string {
    return bar.index ? `index(${bar.index})` : String(i)
  }
}
