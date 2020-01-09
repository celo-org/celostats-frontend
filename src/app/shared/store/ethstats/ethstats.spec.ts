import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { reduceActions } from '../testing-utils'

import * as fromEthstats from './ethstats.reducers'
import * as ethstatesActions from './ethstats.actions'

const reducer = fromEthstats.reducer

describe('Ethstats Store reducers', () => {
  it('should be auto-initialized', () => {
    const finalState = reduceActions(reducer);
    expect(finalState).not.toBeUndefined();
  });

  it('should add nodes', () => {
    const finalState = reduceActions(reducer, [
      ethstatesActions.addNodes({nodes: [{address: '0x0'}]}),
    ]);
    expect(fromEthstats.getNodes(finalState)).toEqual({'0x0': {address: '0x0'}});
  });

  it('should add nodes multiples nodes and not repeat them', () => {
    const states = reduceActions(reducer, [
      ethstatesActions.addNodes({nodes: [{address: '0x0'}]}),
      ethstatesActions.addNodes({nodes: [{address: '0x0'}, {address: '0x1'}]}),
      ethstatesActions.addNodes({nodes: [{address: '0x1'}, {address: '0x2'}]}),
    ], true);

    const finalState = states[states.length - 1]

    const nodesLength = states
      .map(fromEthstats.getNodesList)
      .map(({length}) => length)

    expect(fromEthstats.getNodes(finalState)).toEqual({
      '0x0': {address: '0x0'},
      '0x1': {address: '0x1'},
      '0x2': {address: '0x2'},
    });

    expect(nodesLength).toEqual([0, 1, 2, 3])
  });
});
