import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { color } from 'src/app/shared'

@Component({
  selector: 'component-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent implements OnInit {
  @Input() type: 'big' | 'small' | 'chart' | 'list'
  @Input() icon: string
  @Input() title: string
  @Input() value: string
  @Input() color: color

  ngOnInit(): void {
  }
}
