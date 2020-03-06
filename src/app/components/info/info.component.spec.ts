import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { InfoModule } from './info.module'
import { InfoComponent } from './info.component'

describe('InfoComponent', () => {
  let component: InfoComponent
  let fixture: ComponentFixture<InfoComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        InfoModule,
        NoopAnimationsModule,
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
