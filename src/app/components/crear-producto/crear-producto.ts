import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Producto } from '../../services/producto';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService) {
    this.productoForm = this.fb.group({
      producto: ['', Validators.required],
      categoria: ['', Validators.required],
      ubicacion: ['', Validators.required],
      precio: ['', Validators.required],
    });
  }

  agregarProducto() {
    if (this.productoForm.valid) {
      const nuevoProducto = this.productoForm.value;
      console.log('Producto guardado:', nuevoProducto);
      // Aquí puedes enviar los datos a tu API
      // this.productoService.crearProducto(nuevoProducto).subscribe(...)
      this.toastr.success('¡Producto creado exitosamente!', 'Éxito');
      this.productoForm.reset();
    }

    const PRODUCTO: Producto = {
      nombre: this.productoForm.get('producto')?.value,
      categoria: this.productoForm.get('categoria')?.value,
      ubicacion: this.productoForm.get('ubicacion')?.value,
      precio: this.productoForm.get('precio')?.value,
    }

    console.log(PRODUCTO);
    this.router.navigate(['/']);


  }

}
