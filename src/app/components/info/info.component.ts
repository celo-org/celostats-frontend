import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core'

import { animations } from 'src/app/shared'
import { chartSizeType } from '../chart'

export type infoType = 'big' | 'medium' | 'small' | 'chart' | 'block-proposers'

@Component({
  selector: 'component-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animations.loadingAnimation],
})
export class InfoComponent implements OnInit {
  @Input() type: infoType
  @Input() icon: string
  @Input() title: string
  @Input() value: string
  @Input() sizeType: chartSizeType

  ngOnInit(): void {
  }
}
