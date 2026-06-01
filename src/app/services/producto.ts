import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  
  private http = inject(HttpClient);
  private apiUrl = 'https://techstore-backend-9urc.onrender.com/api';
  
  // ✅ Configurar withCredentials para enviar HttpOnly Cookies automáticamente
  private httpOptions = { withCredentials: true };

  // Obtener todos los productos
  getProductos() {
    return this.http.get(`${this.apiUrl}/productos`, this.httpOptions);
  }

  // Obtener un producto por ID
  getProducto(id: string) {
    return this.http.get(`${this.apiUrl}/productos/${id}`, this.httpOptions);
  }

  // Crear producto (HttpOnly Cookie enviada automáticamente)
  crearProducto(producto: any) {
    return this.http.post(`${this.apiUrl}/productos`, producto, this.httpOptions);
  }

  // Actualizar producto (HttpOnly Cookie enviada automáticamente)
  actualizarProducto(id: string, producto: any) {
    return this.http.put(`${this.apiUrl}/productos/${id}`, producto, this.httpOptions);
  }

  // Eliminar producto (HttpOnly Cookie enviada automáticamente)
  eliminarProducto(id: string) {
    return this.http.delete(`${this.apiUrl}/productos/${id}`, this.httpOptions);
  }

  // Login - Establece la HttpOnly Cookie
  login(credenciales: any) {
    return this.http.post(`${this.apiUrl}/auth/login`, credenciales, this.httpOptions);
  }

  // Register - Establece la HttpOnly Cookie
  register(datos: any) {
    return this.http.post(`${this.apiUrl}/auth/registro`, datos, this.httpOptions);
  }
}