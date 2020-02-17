import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MatTooltipModule } from '@angular/material/tooltip'

import { MicroChartComponent } from './micro-chart.component'

const declarations = [MicroChartComponent]
const modules = [MatTooltipModule]
const providers = []

@NgModule({
  imports: [
    CommonModule,
    ...modules,
  ],
  declarations: [
    ...declarations,
  ],
  exports: [
    ...declarations,
  ],
  providers: [
    ...providers,
  ],
})
export class MicroChartModule { }
