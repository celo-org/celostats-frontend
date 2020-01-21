import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { BlockProposersComponent } from './block-proposers.component'

const declarations = [BlockProposersComponent]
const modules = []
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
export class BlockProposersModule { }
