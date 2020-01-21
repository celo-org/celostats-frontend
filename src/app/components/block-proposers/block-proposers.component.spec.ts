import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BlockProposersModule } from './block-proposers.module'
import { BlockProposersComponent } from './block-proposers.component'

describe('BlockProposers', () => {
  let component: BlockProposersComponent
  let fixture: ComponentFixture<BlockProposersComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BlockProposersModule,
      ],
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockProposersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
