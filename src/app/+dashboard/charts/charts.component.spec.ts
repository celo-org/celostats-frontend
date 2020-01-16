import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DahsboardChartsComponent } from './charts.component'

describe('DahsboardChartsComponent', () => {
  let component: DahsboardChartsComponent
  let fixture: ComponentFixture<DahsboardChartsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DahsboardChartsComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DahsboardChartsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
