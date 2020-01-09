import { TestBed } from '@angular/core/testing';

import { EthstatsService } from './ethstats.service';

describe('EthstatsService', () => {
  let service: EthstatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EthstatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
