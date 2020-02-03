import { TestBed, inject } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { rootEffectsInit } from '@ngrx/effects'
import { Observable, of } from 'rxjs'
import { hot, cold } from 'jasmine-marbles'

import { NodesDataEffects } from './nodes-data.effects'
import * as nodesDataActions from './nodes-data.actions'

describe('NodesDataEffects', () => {
  let actions$: Observable<any>
  let effects: NodesDataEffects

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NodesDataEffects,
        provideMockActions(() => actions$)
      ]
    })

    effects = TestBed.inject(NodesDataEffects)
  })

  it('should be created', () => {
    expect(effects).toBeTruthy()
  })
})
