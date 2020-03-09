import { TestBed } from '@angular/core/testing'
import { provideMockStore } from '@ngrx/store/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Observable } from 'rxjs'

import { SettingsEffects } from './settings.effects'

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
