import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MatIconModule } from '@angular/material/icon'
import { ChartModule } from '../chart'

import { InfoComponent } from './info.component'

const declarations = [InfoComponent]
const modules = [MatIconModule, ChartModule]
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
