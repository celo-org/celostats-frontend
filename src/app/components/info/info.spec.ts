import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ChartsModule } from './charts.module'
import { ChartsComponent } from './charts.component'

describe('ChartsComponent', () => {
  let component: ChartsComponent
  let fixture: ComponentFixture<ChartsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ChartsModule,
      ],
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
