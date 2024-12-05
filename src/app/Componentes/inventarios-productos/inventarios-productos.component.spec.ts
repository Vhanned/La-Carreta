import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosProductosComponent } from './inventarios-productos.component';

describe('InventariosProductosComponent', () => {
  let component: InventariosProductosComponent;
  let fixture: ComponentFixture<InventariosProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventariosProductosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
