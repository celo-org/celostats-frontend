import { Component, Input, ViewChild, OnInit, OnChanges, OnDestroy, SimpleChanges, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { throttleTime, shareReplay, tap } from 'rxjs/operators'

import { colorRange } from 'src/app/shared'

enum BarColor {
  ok = '#35d07f',
  warn1 = '#edfa5a',
  warn2 = '#ffa174',
  warn3 = '#ff7088',
}

@Component({
  selector: 'component-micro-chart',
  templateUrl: './micro-chart.component.html',
  styleUrls: ['./micro-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: number[]
  @ViewChild('canvas', {static: true}) canvas: ElementRef

  private onData$ = new Subject()
  private onDataSubscription: Subscription
  private cleanData: {value: number, color: string}[]
  private ctx: CanvasRenderingContext2D
  private readonly height = 18
  private readonly width = 120
  private readonly barSize = 2
  private readonly barSpace = 1

  constructor(private cdr: ChangeDetectorRef) {
    cdr.detach()
  }

  ngOnInit(): void {
    const canvas = this.canvas.nativeElement
    canvas.width = this.width
    canvas.height = this.height

    this.ctx = canvas.getContext('2d')

    this.onData$.pipe(throttleTime(100))
      .subscribe(() => this.generateChart())

    this.onData$.next()
  }

  ngOnDestroy() {
    this.onDataSubscription.unsubscribe()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      if (JSON.stringify(changes.data.currentValue) === JSON.stringify(changes.data.previousValue)) {
        return
      }
      this.onData$.next()
    }
  }

  generateChart() {
    if (!this.data || !this.ctx) {
      return
    }
    this.generateCleanData()
    this.render()
  }

  generateCleanData() {
    const max = this.data.reduce((acc, _) => Math.max(acc, _), 0)

    this.cleanData = this.data
      .map(_ => ({
        value: Math.max(_ / max, 0),
        color: this.getColor(_),
      }))
  }

  getColor(n: number) {
    const color = colorRange(n, [, 100, 500, 2000])
    return BarColor[color]
  }

  render() {
    const step = this.barSize + this.barSpace
    const ctx = this.ctx

    ctx.clearRect(0, 0, 1000, 1000)

    this.cleanData
      .forEach((({value, color}, i) => {
        const h = Math.max((this.height * value), 1)

        ctx.fillStyle = color
        ctx.fillRect(step * i, this.height - h, this.barSize, h)
      }))
  }
}
