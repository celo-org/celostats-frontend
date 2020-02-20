import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { provideMockStore, MockStore } from '@ngrx/store/testing'
import { DragScrollModule } from 'ngx-drag-scroll'

import { InfoModule } from 'src/app/components/info'

import { DahsboardChartsComponent } from './charts.component'

describe('DahsboardChartsComponent', () => {
  let component: DahsboardChartsComponent
  let fixture: ComponentFixture<DahsboardChartsComponent>
  const initialState = {
    rawData: {nodes: [], lastBlock: {}, charts: {}},
    nodesData: {rawData: {}},
    nodesSorting: {columns: []},
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DahsboardChartsComponent ],
      imports: [
        DragScrollModule,
        InfoModule,
      ],
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
