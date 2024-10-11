import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventeriosProductosComponent } from './inventerios-productos.component';

describe('InventeriosProductosComponent', () => {
  let component: InventeriosProductosComponent;
  let fixture: ComponentFixture<InventeriosProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventeriosProductosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventeriosProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
