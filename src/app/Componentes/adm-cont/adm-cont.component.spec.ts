import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmContComponent } from './adm-cont.component';

describe('AdmContComponent', () => {
  let component: AdmContComponent;
  let fixture: ComponentFixture<AdmContComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmContComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
