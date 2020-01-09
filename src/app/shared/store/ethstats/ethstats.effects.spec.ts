import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { EthstatsEffects } from './ethstats.effects';

describe('EthstatsEffects', () => {
  let actions$: Observable<any>;
  let effects: EthstatsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EthstatsEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<EthstatsEffects>(EthstatsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
