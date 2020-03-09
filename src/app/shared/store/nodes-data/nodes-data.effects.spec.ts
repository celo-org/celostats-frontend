import { TestBed } from '@angular/core/testing'
import { provideMockStore } from '@ngrx/store/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Observable } from 'rxjs'

import { NodesDataEffects } from './nodes-data.effects'

describe('NodesDataEffects', () => {
  let actions$: Observable<any>
  let effects: NodesDataEffects
  const initialState = {
    rawData: {nodes: [], lastBlock: {}, charts: {}},
    nodesData: {rawData: {}},
    nodesSorting: {columns: []},
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NodesDataEffects,
        provideMockActions(() => actions$),
        provideMockStore({initialState}),
      ]
    })

    effects = TestBed.inject(NodesDataEffects)
  })

  it('should be created', () => {
    expect(effects).toBeTruthy()

    actions$ = undefined // Preventing errors
  })
})
