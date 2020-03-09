import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MicroChartModule } from './micro-chart.module'
import { MicroChartComponent } from './micro-chart.component'

describe('MicroChartComponent', () => {
  let component: MicroChartComponent
  let fixture: ComponentFixture<MicroChartComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MicroChartModule,
      ],
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
