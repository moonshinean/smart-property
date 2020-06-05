import { TestBed } from '@angular/core/testing';

import { ChargeCumulativeVacancyfeeService } from './charge-cumulative-vacancyfee.service';

describe('ChargeCumulativeVacancyfeeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargeCumulativeVacancyfeeService = TestBed.get(ChargeCumulativeVacancyfeeService);
    expect(service).toBeTruthy();
  });
});
