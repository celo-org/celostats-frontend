import { TestBed, inject } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Observable } from 'rxjs'

import { reduceActions } from '../testing-utils'

import * as fromSettings from './settings.reducers'
import * as settingsActions from './settings.actions'

const reducer = fromSettings.reducer

describe('Settings Store reducers', () => {
  it('should be auto-initialized', () => {
    const finalState = reduceActions(reducer)
    expect(finalState).not.toBeUndefined()
  })

  it('should pin nodes', () => {
    const finalState = reduceActions(reducer, [
      settingsActions.pinNode({node: 't1', pin: true}),
      settingsActions.pinNode({node: 't2', pin: true}),
      settingsActions.pinNode({node: 't3', pin: true}),
      settingsActions.pinNode({node: 't2', pin: false}),
    ])

    expect(fromSettings.getPinnedNodes(finalState)).toEqual(['t1', 't3'])
  })
})
