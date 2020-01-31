import { TestBed, inject } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Observable } from 'rxjs'

import { reduceActions } from '../testing-utils'

import { Column } from './nodes-sorting.state'
import * as fromEthstats from './nodes-sorting.reducers'
import * as nodesSortingActions from './nodes-sorting.actions'

const reducer = fromEthstats.reducer

describe('Nodes (sorting) Store reducers', () => {
  it('should be auto-initialized', () => {
    const finalState = reduceActions(reducer)
    expect(finalState).not.toBeUndefined()
  })

  it('should set columns', () => {
    const column = {name: 'test', first: true} as Column

    const finalState = reduceActions(reducer, [
      nodesSortingActions.setColumns({columns: [column]}),
    ])

    expect(fromEthstats.getColumns(finalState)).toEqual([column])
    expect(fromEthstats.getSorting(finalState)).toEqual({direction: -1, column})
  })

  it('should update the sorting', () => {
    const columnA = {name: 'A'} as Column
    const columnB = {name: 'B', first: true} as Column

    const states = reduceActions(reducer, [
      nodesSortingActions.setColumns({columns: [columnA, columnB]}),
      nodesSortingActions.sortNodes({column: columnB}),
      nodesSortingActions.sortNodes({column: columnA}),
      nodesSortingActions.sortNodes({column: columnA}),
    ], true)

    const sorting = states
      .map(fromEthstats.getSorting)

    expect(sorting).toEqual([
      undefined,
      {direction: -1, column: columnB},
      {direction: 1, column: columnB},
      {direction: -1, column: columnA},
      {direction: 1, column: columnA},
    ])
  })
})
