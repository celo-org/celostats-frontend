import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MatIconModule } from '@angular/material/icon'
import { ChartModule } from '../chart'
import { BlockProposersModule } from '../block-proposers'

import { InfoComponent } from './info.component'

const declarations = [InfoComponent]
const modules = [MatIconModule, ChartModule, BlockProposersModule]
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
export class InfoModule { }
