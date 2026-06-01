import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarProductos } from './listar-productos';

describe('ListarProductos', () => {
  let component: ListarProductos;
  let fixture: ComponentFixture<ListarProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarProductos],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarProductos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
