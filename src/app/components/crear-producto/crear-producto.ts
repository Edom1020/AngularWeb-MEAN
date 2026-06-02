import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Producto } from '../../models/producto';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto';

@Component({
  selector: 'app-crear-producto',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './crear-producto.html',
  styleUrl: './crear-producto.css',
})
export class CrearProductoComponent{
  productoForm: FormGroup;

  constructor(private fb: FormBuilder, 
    private router: Router,
    private toastr: ToastrService,
    private productoService: ProductoService) {
    this.productoForm = this.fb.group({
      producto: ['', Validators.required],
      categoria: ['', Validators.required],
      ubicacion: ['', Validators.required],
      precio: ['', Validators.required],
    });
  }

agregarProducto() {
  if (this.productoForm.valid) {
    const nuevoProducto = {
      nombre: this.productoForm.get('producto')?.value,
      categoria: this.productoForm.get('categoria')?.value,
      ubicacion: this.productoForm.get('ubicacion')?.value,
      precio: this.productoForm.get('precio')?.value,
    };

    this.productoService.crearProducto(nuevoProducto).subscribe({
      next: () => {
        this.toastr.success('¡Producto creado exitosamente!', 'Éxito');
        this.productoForm.reset();
        this.router.navigate(['/listar-productos']);
      },
      error: () => {
        this.toastr.error('Error al crear producto', 'Error');
      }
    });
  }
}

  
}


