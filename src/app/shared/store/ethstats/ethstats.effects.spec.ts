import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { rootEffectsInit } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { hot, cold, time, getTestScheduler } from 'jasmine-marbles';

import { EthstatsService } from '../../ethstats.service'
import { EthstatsEffects } from './ethstats.effects';
import * as ethstatesActions from './ethstats.actions'

describe('EthstatsEffects', () => {
  let actions$: Observable<any>;
  let effects: EthstatsEffects;
  let ethstatsService: EthstatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EthstatsEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(EthstatsEffects);
    ethstatsService = TestBed.get(EthstatsService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should dispatch new block events', () => {
    actions$ = of(rootEffectsInit())

    spyOn(ethstatsService, 'data').and.returnValue(
      cold('-t-aat-b', {
        t: {action: 'test', data: {}},
        a: {action: 'block', data: {block: {number: 1, test: 'block'}}},
        b: {action: 'block', data: {block: {number: 2, test: 'block'}}},
      }),
    );

    const expected = hot('---a---b', {
      a: ethstatesActions.setLastBlock({block: {number: 1, test: 'block'} as any}),
      b: ethstatesActions.setLastBlock({block: {number: 2, test: 'block'} as any}),
    });

    expect(effects.listenNewBlocks$).toBeObservable(expected)
  });

  it('should dispatch new nodes', () => {
    actions$ = of(rootEffectsInit())

    const bufferTimeMarbles=    '------|'//--|-----|-----|-----|
    const ethstatsDataMarbles = '--abac--x-x--dabcd--------------|'
    const expectedMarbles =     '------a-----------b-------------|'

    spyOn(ethstatsService, 'data').and.returnValue(
      cold(ethstatsDataMarbles, {
        a: {action: 'add', data: {id: '0xa'}},
        b: {action: 'block', data: {id: '0xb'}},
        c: {action: 'pending', data: {id: '0xc'}},
        d: {action: 'stats', data: {id: '0xd'}},
        x: {action: 'test', data: {}},
      }),
    );

    const expected = hot(expectedMarbles, {
      a: ethstatesActions.updateNodes({
        nodes: ['a', 'b', 'a', 'c'].map(_ => ({id: '0x' + _})) as any
      }),
      b: ethstatesActions.updateNodes({
        nodes: ['d', 'a', 'b','c','d'].map(_ => ({id: '0x' + _})) as any
      }),
    });

    expect(effects.listenNewNodes$({buffer: time(bufferTimeMarbles), scheduler: getTestScheduler()}))
      .toBeObservable(expected)
  });
});
