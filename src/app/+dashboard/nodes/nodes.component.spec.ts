import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { provideMockStore, MockStore } from '@ngrx/store/testing'

import { AppModule } from '../../app.module'
import { DashboardNodesComponent } from './nodes.component'

describe('NodesComponent', () => {
  let component: DashboardNodesComponent
  let fixture: ComponentFixture<DashboardNodesComponent>
  const initialState = {ethstats: {nodes: [], lastBlock: {}}}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardNodesComponent ],
      providers: [ provideMockStore({initialState}) ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardNodesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
