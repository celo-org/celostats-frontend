import { TestBed, inject } from '@angular/core/testing'
import { provideMockStore } from '@ngrx/store/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { rootEffectsInit } from '@ngrx/effects'
import { Observable, of } from 'rxjs'
import { hot, cold } from 'jasmine-marbles'

import { SettingsEffects } from './settings.effects'
import * as nodesDataActions from './settings.actions'

describe('SettingsEffects', () => {
  let actions$: Observable<any>
  let effects: SettingsEffects
  const initialState = {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SettingsEffects,
        provideMockActions(() => actions$),
        provideMockStore({initialState}),
      ]
    })

    effects = TestBed.inject(SettingsEffects)
  })

  it('should be created', () => {
    expect(effects).toBeTruthy()

    actions$ = undefined // Preventing errors
  })
})
