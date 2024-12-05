import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosTerminadosComponent } from './productos-terminados.component';

describe('ProductosTerminadosComponent', () => {
  let component: ProductosTerminadosComponent;
  let fixture: ComponentFixture<ProductosTerminadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductosTerminadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosTerminadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
