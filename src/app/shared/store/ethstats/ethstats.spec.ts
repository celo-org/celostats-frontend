import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { reduceActions } from '../testing-utils'

import { EthstatsNode } from './ethstats.state'
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
      ethstatesActions.addNodes({nodes: [{id: '0x0'}] as EthstatsNode[]}),
    ]);
    expect(fromEthstats.getNodes(finalState)).toEqual({'0x0': {id: '0x0'} as EthstatsNode});
  });

  it('should add nodes multiples nodes and not repeat them', () => {
    const states = reduceActions(reducer, [
      ethstatesActions.addNodes({nodes: [{id: '0x0'}] as EthstatsNode[]}),
      ethstatesActions.addNodes({nodes: [{id: '0x0'}, {id: '0x1'}] as EthstatsNode[]}),
      ethstatesActions.addNodes({nodes: [{id: '0x1'}, {id: '0x2'}] as EthstatsNode[]}),
    ], true);

    const finalState = states[states.length - 1]

    const nodesLength = states
      .map(fromEthstats.getNodesList)
      .map(({length}) => length)

    expect(fromEthstats.getNodes(finalState)).toEqual({
      '0x0': {id: '0x0'} as EthstatsNode,
      '0x1': {id: '0x1'} as EthstatsNode,
      '0x2': {id: '0x2'} as EthstatsNode,
    });

    expect(nodesLength).toEqual([0, 1, 2, 3])
  });
});
