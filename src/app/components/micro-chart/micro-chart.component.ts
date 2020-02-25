import {
  Component,
  Input,
  ViewChild,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectionStrategy,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core'
import { Subject, Subscription, animationFrameScheduler, interval, fromEvent } from 'rxjs'
import { debounceTime, shareReplay, throttle, map, tap, combineLatest, mergeMap, takeUntil, startWith, endWith, distinctUntilChanged } from 'rxjs/operators'

import { colorRange } from 'src/app/shared'

// Seen on: https://stackoverflow.com/a/7838871
declare global {
  interface CanvasRenderingContext2D {
    roundRect: (this: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => CanvasRenderingContext2D
  }
}
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2
  if (h < 2 * r) r = h / 2
  this.beginPath()
  this.moveTo(x+r, y)
  this.arcTo(x+w, y,   x+w, y+h, r)
  this.arcTo(x+w, y+h, x,   y+h, r)
  this.arcTo(x,   y+h, x,   y,   r)
  this.arcTo(x,   y,   x+w, y,   r)
  this.closePath()
  return this
}




enum BarColor {
  info = '#3c9bf4',
  ok = '#42d689',
  warn1 = '#fbcc5c',
  warn2 = '#ffa174',
  warn3 = '#fb7c6d',
  no = '#cccccc',
}

@Component({
  selector: 'component-micro-chart',
  templateUrl: './micro-chart.component.html',
  styleUrls: ['./micro-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: number[]
  @Input() show: (n: number) => string
  @ViewChild('canvas', {static: true}) canvas: ElementRef

  private onData$ = new Subject()
  private onDataSubscription: Subscription
  private cleanData: {value: number, color: string, label: string}[]
  private ctx: CanvasRenderingContext2D
  private noColor: boolean
  private readonly height = 18
  private readonly width = 120
  private readonly barMinHeight = 2
  private readonly barSize = 2
  private readonly barSpace = 1
  private readonly barNum = 40
  private readonly labelPadding = 2

  constructor(private cdr: ChangeDetectorRef) {
    cdr.detach()
  }

  ngOnInit(): void {
    const canvas = this.canvas.nativeElement
    canvas.width = this.width
    canvas.height = this.height

    this.ctx = canvas.getContext('2d')

    this.onData$
      .pipe(
        debounceTime(100),
        throttle(() => interval(0, animationFrameScheduler)),
        combineLatest(
          fromEvent(canvas, 'mouseenter')
            .pipe(
              mergeMap(() =>
                fromEvent(canvas, 'mousemove')
                  .pipe(
                    map(({offsetX}) => Math.floor((offsetX - this.barSize) / (this.barSize + this.barSpace))),
                    map(bar => Math.max(0, Math.min(this.barNum - 1, bar))),
                    takeUntil(fromEvent(canvas, 'mouseleave')),
                    endWith(false),
                  ),
              ),
              startWith(false),
              distinctUntilChanged(),
            ),
        ),
      )
      .subscribe(([, x]) => this.generateChart(x))

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

  generateChart(hoverBar: number | boolean) {
    if (!this.data || !this.ctx) {
      return
    }
    this.generateCleanData()
    this.render(hoverBar)
  }

  generateCleanData() {
    const data = [...this.data || []]
    const max = data.reduce((acc, _) => Math.max(acc, _), 0)

    this.cleanData = data
      .slice(0, 40)
      .map(_ => ({
        value: Math.max(_ / max, 0),
        color: this.getColor(_),
        label: this?.show(_) || String(_),
      }))

    if (this.cleanData.length < this.barNum) {
      this.cleanData = [
        ...this.cleanData,
        ...new Array(this.barNum - this.cleanData.length)
          .fill({value: 0, color: BarColor.no, label: 'n/a'}),
      ] as any[]
    }
  }

  getColor(n: number) {
    const color = colorRange(n, [1, 100, 500, 2000])
    return BarColor[color]
  }

  render(hoverBar: number | boolean) {
    const step = this.barSize + this.barSpace
    const ctx = this.ctx

    ctx.clearRect(0, 0, this.width, this.height)
    this.cleanData
      .forEach((({value, color}, i) => {
        if (hoverBar !== false) {
          ctx.globalAlpha = i === hoverBar ? 1 : 0.5
        }
        const h = Math.max(((this.height - this.barMinHeight) * value), 0) + this.barMinHeight

        ctx.fillStyle = color
        ctx.fillRect(step * i, this.height - h, this.barSize, h)
      }))
    ctx.globalAlpha = 1

    if (typeof hoverBar === 'number') {
      const isLeft = hoverBar < (this.barNum / 2)
      const bar = this.cleanData[hoverBar] || {label: 'n/a'}

      ctx.font = `10px "Roboto Mono"`

      const {width} = ctx.measureText(bar.label)
      const padding = (this.height / 2) - this.labelPadding
      const startFrom = !isLeft
        ? this.labelPadding
        : this.width - this.barSpace - (width + (padding * 2)) - this.labelPadding

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.roundRect(
        startFrom,
        this.labelPadding,
        width + (padding * 2),
        (this.height - this.labelPadding * 2),
        padding,
      )
      ctx.fill()

      ctx.fillStyle = '#000000'
      ctx.textBaseline = 'middle'
      ctx.fillText(bar.label, startFrom + padding, this.height / 2 + 1)
    }
  }
}
