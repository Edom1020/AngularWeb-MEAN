import { Routes } from '@angular/router';
import { CrearProductoComponent } from './components/crear-producto/crear-producto';
import { ListarProductosComponent } from './components/listar-productos/listar-productos';
import { LoginComponent } from './components/login/login';
import { CatalogoProductosComponent } from './components/catalogo-productos/catalogo-productos';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'catalogo', component: CatalogoProductosComponent },
    { path: 'listar-productos', component: ListarProductosComponent },
    { path: 'crear-producto', component: CrearProductoComponent },
    { path: 'editar-producto/:id', component: CrearProductoComponent },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
