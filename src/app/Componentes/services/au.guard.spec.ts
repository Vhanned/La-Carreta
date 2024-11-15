import { TestBed } from '@angular/core/testing';

import { AuGuard } from './au.guard';

describe('AuGuard', () => {
  let guard: AuGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
