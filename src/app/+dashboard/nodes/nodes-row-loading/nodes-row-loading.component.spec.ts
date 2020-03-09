import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { provideMockStore } from '@ngrx/store/testing'

import { DashboardNodesRowLoadingComponent } from './nodes-row-loading.component'

describe('DashboardNodesRowLoadingComponent', () => {
  let component: DashboardNodesRowLoadingComponent
  let fixture: ComponentFixture<DashboardNodesRowLoadingComponent>
  const initialState = {
    rawData: {nodes: [], lastBlock: {}, charts: {}},
    nodesData: {rawData: {}},
    nodesSorting: {columns: []},
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardNodesRowLoadingComponent ],
      providers: [ provideMockStore({initialState}) ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardNodesRowLoadingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
