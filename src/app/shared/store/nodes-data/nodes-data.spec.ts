import { TestBed, inject } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Observable } from 'rxjs'

import { reduceActions } from '../testing-utils'

import * as fromNodesData from './nodes-data.reducers'
import * as nodesDataActions from './nodes-data.actions'

const reducer = fromNodesData.reducer

describe('Nodes (data) Store reducers', () => {
  it('should be auto-initialized', () => {
    const finalState = reduceActions(reducer)
    expect(finalState).not.toBeUndefined()
  })

  it('should update the rows', () => {
    const finalState = reduceActions(reducer, [
      nodesDataActions.updateRawData({rows: [
        {id: 't1', columns: [undefined]},
        {id: 't2', columns: [undefined]},
      ]}),
      nodesDataActions.updateRawData({rows: [
        {id: 't1', columns: [undefined, undefined]},
      ]}),
    ])

    expect(fromNodesData.getRawData(finalState)).toEqual({
        t1: {id: 't1', columns: [undefined, undefined]},
        t2: {id: 't2', columns: [undefined]},
    })
  })

  it('should set the clean data', () => {
    const finalState = reduceActions(reducer, [
      nodesDataActions.setCleanData({rows: [
        {id: 't1', columns: [undefined, undefined]},
      ]}),
      nodesDataActions.setCleanData({rows: [
        {id: 't1', columns: [undefined]},
        {id: 't2', columns: [undefined]},
      ]}),
    ])

    expect(fromNodesData.getCleanData(finalState)).toEqual([
        {id: 't1', columns: [undefined]},
        {id: 't2', columns: [undefined]},
    ])
  })
})
