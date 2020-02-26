import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'component-info-icon',
  templateUrl: './info-icon.component.html',
  styleUrls: ['./info-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoIconComponent {
  @Input() icon: string
}
