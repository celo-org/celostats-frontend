import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core'

import { color } from 'src/app/shared'
import { chartSizeType } from '../chart'

export type infoType = 'big' | 'medium' | 'small' | 'chart' | 'block-proposers'

@Component({
  selector: 'component-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent implements OnInit {
  @Input() type: infoType
  @Input() icon: string
  @Input() title: string
  @Input() value: string
  @Input() color: color
  @Input() sizeType: chartSizeType

  ngOnInit(): void {
  }
}
