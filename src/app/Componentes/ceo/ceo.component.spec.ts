import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CEOComponent } from './ceo.component';

describe('CEOComponent', () => {
  let component: CEOComponent;
  let fixture: ComponentFixture<CEOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CEOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CEOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
