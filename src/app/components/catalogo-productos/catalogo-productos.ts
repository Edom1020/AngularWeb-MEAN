import { Component, OnInit, inject } from '@angular/core';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductoService } from '../../services/producto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-catalogo-productos',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, CurrencyPipe],
  templateUrl: './catalogo-productos.html',
  styleUrl: './catalogo-productos.css'
})
export class CatalogoProductosComponent implements OnInit {
  productos: any[] = [];
  private productoService = inject(ProductoService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productoService.getProductos().subscribe({
      next: (data: any) => {
        console.log('data completa:', data);
        this.productos = data.productos;
        console.log('productos asignados:', this.productos.length);
      },
      error: (err) => {
        console.log('error:', err);
        this.toastr.error('No se pudo cargar el catálogo', 'Error');
      }
    });
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.toastr.info('Has salido del catálogo', 'Sesión Finalizada');
    this.router.navigate(['/login']);
  }
}
