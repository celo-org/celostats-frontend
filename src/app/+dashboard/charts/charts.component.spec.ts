import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { provideMockStore, MockStore } from '@ngrx/store/testing'

import { DahsboardChartsComponent } from './charts.component'

describe('DahsboardChartsComponent', () => {
  let component: DahsboardChartsComponent
  let fixture: ComponentFixture<DahsboardChartsComponent>
  const initialState = {ethstats: {nodes: [], lastBlock: {}, charts: {}}}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DahsboardChartsComponent ],
      providers: [ provideMockStore({initialState}) ],
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
