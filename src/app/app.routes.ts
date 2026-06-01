import { Routes } from '@angular/router';
import { CrearProductoComponent } from './components/crear-producto/crear-producto';
import { ListarProductosComponent } from './components/listar-productos/listar-productos';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: ListarProductosComponent },
    { path: 'crear-producto', component: CrearProductoComponent },
    { path: 'editar-producto/:id', component: CrearProductoComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

