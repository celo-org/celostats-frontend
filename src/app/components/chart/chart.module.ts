import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MatTooltipModule } from '@angular/material/tooltip'

import { ChartComponent } from './chart.component'

const declarations = [ChartComponent]
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
export class ChartModule { }
