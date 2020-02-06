import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { provideMockStore } from '@ngrx/store/testing'

import { DashboardNodesRowComponent } from './nodes-row.component'

describe('NodesRowComponent', () => {
  let component: DashboardNodesRowComponent
  let fixture: ComponentFixture<DashboardNodesRowComponent>
  const initialState = {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardNodesRowComponent ],
      providers: [ provideMockStore({initialState}) ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardNodesRowComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
