import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesProduccionComponent } from './reportes-produccion.component';

describe('ReportesProduccionComponent', () => {
  let component: ReportesProduccionComponent;
  let fixture: ComponentFixture<ReportesProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesProduccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
