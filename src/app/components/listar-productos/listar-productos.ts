import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

//Nuevos imports
import { ProductoService } from '../../services/producto';
import { ToastrService } from 'ngx-toastr';

interface Producto {
  _id?: string;
  id?: number;
  nombre: string;
  categoria: string;
  ubicacion: string;
  precio: number;
}

@Component({
  selector: 'app-listar-productos',
  imports: [RouterLink, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './listar-productos.html',
  styleUrl: './listar-productos.css',
})

// Componente para listar, editar y eliminar productos
export class ListarProductosComponent implements OnInit {
  productos: Producto[] = [];
  private productoService = inject(ProductoService);
  private toastr = inject(ToastrService);

  editForm: FormGroup;
  showEditModal = false;
  showDeleteModal = false;
  productoSeleccionado: Producto | null = null;

  ngOnInit() {
  this.cargarProductos();
  }

  cargarProductos() {
  this.productoService.getProductos().subscribe({
    next: (data: any) => {
      this.productos = data.productos;
    },
    error: () => {
      this.toastr.error('Error al cargar productos', 'Error');
    }
  });
}

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['', Validators.required],
      ubicacion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
    });
  }

  abrirEditModal(producto: Producto) {
    this.productoSeleccionado = producto;
    this.editForm.patchValue({
      nombre: producto.nombre,
      categoria: producto.categoria,
      ubicacion: producto.ubicacion,
      precio: producto.precio,
    });
    this.showEditModal = true;
  }

  cerrarEditModal() {
    this.showEditModal = false;
    this.productoSeleccionado = null;
    this.editForm.reset();
  }

  guardarEdicion() {
  if (this.editForm.valid && this.productoSeleccionado) {
    this.productoService.actualizarProducto(
      this.productoSeleccionado._id!, 
      this.editForm.value
    ).subscribe({
      next: () => {
        this.toastr.success('Producto actualizado', 'Éxito');
        this.cargarProductos();
        this.cerrarEditModal();
      },
      error: () => {
        this.toastr.error('Error al actualizar', 'Error');
      }
    });
  }
}

  abrirDeleteModal(producto: Producto) {
    this.productoSeleccionado = producto;
    this.showDeleteModal = true;
  }

  cerrarDeleteModal() {
    this.showDeleteModal = false;
    this.productoSeleccionado = null;
  }

  confirmarEliminar() {
  if (this.productoSeleccionado) {
    this.productoService.eliminarProducto(this.productoSeleccionado._id!).subscribe({
      next: () => {
        this.toastr.success('Producto eliminado', 'Éxito');
        this.cargarProductos();
        this.cerrarDeleteModal();
      },
      error: () => {
        this.toastr.error('Error al eliminar', 'Error');
      }
    });
  }
}
}
