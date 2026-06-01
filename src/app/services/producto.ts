import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  
  private http = inject(HttpClient);
  private apiUrl = 'https://techstore-backend-9urc.onrender.com/api';

 private getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    withCredentials: true,
    headers: { Authorization: `Bearer ${token}` }
  };
}

  getProductos() {
    return this.http.get(`${this.apiUrl}/productos`, this.getAuthHeaders());
  }

  getProducto(id: string) {
    return this.http.get(`${this.apiUrl}/productos/${id}`, this.getAuthHeaders());
  }

  crearProducto(producto: any) {
    return this.http.post(`${this.apiUrl}/productos`, producto, this.getAuthHeaders());
  }

  actualizarProducto(id: string, producto: any) {
    return this.http.put(`${this.apiUrl}/productos/${id}`, producto, this.getAuthHeaders());
  }

  eliminarProducto(id: string) {
    return this.http.delete(`${this.apiUrl}/productos/${id}`, this.getAuthHeaders());
  }

  login(credenciales: any) {
    return this.http.post(`${this.apiUrl}/auth/login`, credenciales, { withCredentials: true });
  }

  register(datos: any) {
    return this.http.post(`${this.apiUrl}/auth/registro`, datos, { withCredentials: true });
  }
}