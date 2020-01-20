import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InfoModule } from './info.module'
import { InfoComponent } from './info.component'

describe('InfoComponent', () => {
  let component: InfoComponent
  let fixture: ComponentFixture<InfoComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        InfoModule,
      ],
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
