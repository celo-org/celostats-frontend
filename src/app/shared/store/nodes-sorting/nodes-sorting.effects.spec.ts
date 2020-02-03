import { TestBed, inject } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { rootEffectsInit } from '@ngrx/effects'
import { Observable, of, Subject } from 'rxjs'
import { hot, cold } from 'jasmine-marbles'

import { columns } from './columns.data'
import { NodesSortingEffects } from './nodes-sorting.effects'
import * as nodesSortingActions from './nodes-sorting.actions'

describe('NodesSortingEffects', () => {
  let actions$: Observable<any>
  let effects: NodesSortingEffects

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NodesSortingEffects,
        provideMockActions(() => actions$)
      ]
    })

    effects = TestBed.inject(NodesSortingEffects)
  })

  it('should be created', () => {
    expect(effects).toBeTruthy()
  })

  it('should dispatch the columns config', (done) => {
    actions$ = new Subject()

    effects.setColumns$
      .subscribe(({columns: _}) => {
        const getName = ({name}) => name
        expect(_.map(getName)).toEqual(columns.map(getName))
        done()
      })

    ;(actions$ as Subject<any>).next(rootEffectsInit())
  })
})
