import { TestBed, inject } from '@angular/core/testing'
import { provideMockStore } from '@ngrx/store/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { rootEffectsInit } from '@ngrx/effects'
import { Observable, of } from 'rxjs'
import { hot, cold } from 'jasmine-marbles'

import { actions as ethstatsActions } from 'src/app/shared/store/ethstats'
import { NodesDataEffects } from './nodes-data.effects'
import * as nodesDataActions from './nodes-data.actions'

describe('NodesDataEffects', () => {
  let actions$: Observable<any>
  let effects: NodesDataEffects
  const initialState = {
    ethstats: {nodes: [], lastBlock: {}, charts: {}},
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
