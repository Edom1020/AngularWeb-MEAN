import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

interface Producto {
  id: number;
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
export class ListarProductosComponent {
  productos: Producto[] = [
    { id: 1, nombre: 'Coca Cola', categoria: 'Bebida', ubicacion: 'Buenos Aires', precio: 2 },
    { id: 2, nombre: 'Laptop HP', categoria: 'Computadores', ubicacion: 'Colombia', precio: 2500 },
  ];

  editForm: FormGroup;
  showEditModal = false;
  showDeleteModal = false;
  productoSeleccionado: Producto | null = null;

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
      const index = this.productos.findIndex(p => p.id === this.productoSeleccionado?.id);
      if (index !== -1) {
        this.productos[index] = {
          ...this.productoSeleccionado,
          ...this.editForm.value
        };
        console.log('Producto actualizado:', this.productos[index]);
        alert('Producto actualizado exitosamente');
        this.cerrarEditModal();
      }
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
      this.productos = this.productos.filter(p => p.id !== this.productoSeleccionado?.id);
      console.log('Producto eliminado:', this.productoSeleccionado);
      alert('Producto eliminado exitosamente');
      this.cerrarDeleteModal();
    }
  }
}
