# 📚 Documentación del Proyecto - Cliente MEAN

> **Estado:** En desarrollo
> **Versión:** 1.0.0
> **Fecha:** Junio 2026

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Componentes](#componentes)
5. [Modelos y Servicios](#modelos-y-servicios)
6. [Rutas Configuradas](#rutas-configuradas)
7. [Funcionalidades Implementadas](#funcionalidades-implementadas)
8. [Instalación y Ejecución](#instalación-y-ejecución)
9. [Estado de Desarrollo](#estado-de-desarrollo)

---

## 🎯 Descripción General

**Mi Lista de Libros** es una aplicación web de gestión de productos/libros construida con Angular 21 en la arquitectura **MEAN** (MongoDB, Express, Angular, Node.js). La aplicación permite a los usuarios:

- Autenticarse mediante login y registro
- Crear nuevos productos
- Listar y gestionar productos existentes
- Editar y eliminar productos
- Validación de datos en tiempo real

**Nota:** Este es el cliente (frontend) del proyecto. El backend (API) se gestiona desde otro repositorio.

---

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Angular 21.2.0** - Framework principal
- **TypeScript 5.9** - Lenguaje de programación
- **Bootstrap 5.3.8** - Framework CSS para estilos
- **RxJS 7.8** - Gestión reactiva

### Herramientas

- **Angular CLI 21.2.13** - Herramienta de línea de comandos
- **Vitest 4.0.8** - Test runner para pruebas unitarias
- **Prettier 3.8.1** - Formateador de código
- **Node.js 20.x** - Runtime de JavaScript

### Librerías adicionales

- **ngx-toastr 20.0.5** - Notificaciones tipo toast
- **Express 5.1.0** - Para SSR (Server-Side Rendering)
- **@angular/ssr 21.2.13** - Server-Side Rendering

---

## 📁 Estructura del Proyecto

```
cliente/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/                    # Componente de login y registro
│   │   │   │   ├── login.ts
│   │   │   │   ├── login.html
│   │   │   │   └── login.css
│   │   │   ├── listar-productos/         # Componente de listado de productos
│   │   │   │   ├── listar-productos.ts
│   │   │   │   ├── listar-productos.html
│   │   │   │   └── listar-productos.css
│   │   │   └── crear-producto/           # Componente de crear/editar productos
│   │   │       ├── crear-producto.ts
│   │   │       ├── crear-producto.html
│   │   │       └── crear-producto.css
│   │   ├── models/
│   │   │   └── producto.ts               # Modelo de Producto
│   │   ├── services/
│   │   │   └── producto.ts               # Servicio de Producto
│   │   ├── app.ts                        # Componente raíz
│   │   ├── app.html                      # Template raíz
│   │   ├── app.css                       # Estilos raíz
│   │   ├── app.routes.ts                 # Configuración de rutas
│   │   ├── app.config.ts                 # Configuración de la app
│   │   └── app.config.server.ts          # Configuración SSR
│   ├── main.ts                           # Punto de entrada
│   ├── main.server.ts                    # Punto de entrada SSR
│   ├── index.html                        # HTML principal
│   └── styles.css                        # Estilos globales
├── public/
│   ├── images/                           # Imágenes del proyecto
│   └── login/                            # Imágenes login
├── angular.json                          # Configuración de Angular
├── package.json                          # Dependencias del proyecto
├── tsconfig.json                         # Configuración de TypeScript
└── README.md                             # README original

```

---

## 🧩 Componentes

### 1. **LoginComponent** 🔐

**Archivo:** `src/app/components/login/login.ts`

**Funcionalidades:**

- **Pestaña de Login:** Permite a usuarios existentes iniciar sesión
  - Campo de email con validación
  - Campo de contraseña con botón mostrar/ocultar
  - Validación en tiempo real del formulario
- **Pestaña de Registro:** Permite crear nuevas cuentas
  - Campo de nombre completo (mínimo 3 caracteres)
  - Campo de email con validación
  - Campo de contraseña con validación de requisitos:
    - ✅ Mínimo 12 caracteres
    - ✅ Al menos una mayúscula
    - ✅ Al menos un número
    - ✅ Al menos un carácter especial (!@#$%^&\*)
  - Campo de confirmación de contraseña
  - Recuadro interactivo mostrando requisitos en tiempo real (se ponen verdes al cumplirse)

**Validaciones:**

- Reactive Forms con validadores personalizados
- Validador de contraseña que verifica todos los requisitos
- Validador de coincidencia de contraseñas
- Mensajes de error dinámicos

**Estados Visuales:**

- Toggle entre pestaña Login y Registro
- Visualización de contraseña (eye icon)
- Requierimientos de contraseña que cambian de color a verde según se cumplan

### 2. **ListarProductosComponent** 📦

**Archivo:** `src/app/components/listar-productos/listar-productos.ts`

**Funcionalidades:**

- Listado de productos en tabla
- **Datos de prueba:** 2 productos iniciales (Coca Cola, Laptop HP)
- **Editar producto:**
  - Modal de edición
  - Formulario editable con validación
  - Actualización en tiempo real
- **Eliminar producto:**
  - Modal de confirmación
  - Eliminación de la lista

**Campos de Producto:**

- ID
- Nombre
- Categoría
- Ubicación
- Precio

**Validaciones:**

- Nombre: requerido, mínimo 3 caracteres
- Categoría: requerida
- Ubicación: requerida
- Precio: requerido, mínimo 0

### 3. **CrearProductoComponent** ➕

**Archivo:** `src/app/components/crear-producto/crear-producto.ts`

**Funcionalidades:**

- Formulario para crear nuevos productos
- Validación de campos
- Notificación toast al crear exitosamente
- Redirección a la lista de productos tras crear

**Campos del Formulario:**

- Producto (nombre)
- Categoría
- Ubicación
- Precio

**Integración:**

- Uso de ngx-toastr para notificaciones
- Router para navegación post-creación
- Preparado para conectar con API backend

---

## 📊 Modelos y Servicios

### Modelo: Producto

**Archivo:** `src/app/models/producto.ts`

```typescript
export class Producto {
  _id?: number;
  nombre: string;
  categoria: string;
  ubicacion: string;
  precio: number;

  constructor(nombre: string, categoria: string, ubicacion: string, precio: number);
}
```

### Servicio: Producto

**Archivo:** `src/app/services/producto.ts`

**Estado Actual:** Servicio base inyectable

- Listo para implementar métodos CRUD
- Preparado para conectar con el backend API

**Métodos Pendientes:**

- `crearProducto()`
- `obtenerProductos()`
- `obtenerProductoPorId()`
- `actualizarProducto()`
- `eliminarProducto()`

---

## 🛣️ Rutas Configuradas

**Archivo:** `src/app/app.routes.ts`

| Ruta                   | Componente               | Descripción                             |
| ---------------------- | ------------------------ | --------------------------------------- |
| `/login`               | LoginComponent           | Página de login y registro              |
| `/`                    | ListarProductosComponent | Página principal - Listado de productos |
| `/crear-producto`      | CrearProductoComponent   | Crear nuevo producto                    |
| `/editar-producto/:id` | CrearProductoComponent   | Editar producto existente               |
| `**`                   | → `/`                    | Redirección por defecto                 |

---

## ✨ Funcionalidades Implementadas

### ✅ Autenticación (Frontend)

- [x] Formulario de login con validación
- [x] Formulario de registro con validación compleja
- [x] Validación de requisitos de contraseña en tiempo real
- [x] Toggle mostrar/ocultar contraseña
- [x] Validación de coincidencia de contraseñas

### ✅ Gestión de Productos

- [x] Listado de productos
- [x] Crear producto
- [x] Editar producto (con modal)
- [x] Eliminar producto (con confirmación)
- [x] Validación de formularios

### ✅ UI/UX

- [x] Interfaz responsive con Bootstrap
- [x] Modales para editar y eliminar
- [x] Notificaciones toast (ngx-toastr)
- [x] Animaciones y transiciones
- [x] Recuadro interactivo de requisitos de contraseña

### ⏳ Funcionalidades Pendientes

- [ ] Conectar con API backend
- [ ] Implementar autenticación JWT
- [ ] Guardar sesión de usuario
- [ ] Pagination en listado de productos
- [ ] Búsqueda y filtrado
- [ ] Pruebas unitarias (Vitest)
- [ ] Pruebas e2e
- [ ] Mejorar manejo de errores HTTP

---

## 💻 Instalación y Ejecución

### Requisitos Previos

- Node.js 20.x o superior
- npm 11.x o superior
- Angular CLI 21.x

### Pasos de Instalación

```bash
# 1. Navegar al directorio del proyecto
cd cliente

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm start

# 4. Abrir en navegador
# La aplicación estará disponible en: http://localhost:4200
```

### Comandos Disponibles

```bash
# Servidor de desarrollo
npm start                   # Inicia en http://localhost:4200

# Compilación
npm run build              # Build para producción
npm run watch              # Build en modo watch

# Pruebas
npm test                   # Ejecutar pruebas unitarias

# SSR
npm run serve:ssr:cliente  # Ejecutar con Server-Side Rendering
```

---

## 📈 Estado de Desarrollo

### Fase Actual: **Desarrollo - Frontend Completado**

### Lo que está Hecho

✅ Estructura base de Angular 21
✅ Componentes principales creados
✅ Autenticación frontend (login/registro)
✅ Validación avanzada de contraseñas
✅ Gestión básica de productos
✅ Interfaz de usuario con Bootstrap
✅ Rutas configuradas
✅ Notificaciones con toast

### Lo que Falta

- [ ] Conectar servicio de Producto con API REST
- [ ] Implementar HttpClient para llamadas HTTP
- [ ] Gestión de errores HTTP
- [ ] Token JWT para autenticación
- [ ] Guards para rutas protegidas
- [ ] Interceptor HTTP
- [ ] Cache de datos
- [ ] Pruebas unitarias
- [ ] Documentación de API

### Próximos Pasos

1. Crear servicio HTTP para consumir API backend
2. Implementar guards de autenticación
3. Agregar interceptor para JWT
4. Hacer pruebas unitarias
5. Optimizar performance

---

## 🎨 Paleta de Colores y Estilos

- **Verde Primario:** `#119b3adc` (Títulos)
- **Verde Botón:** `#117408` (Botones principales)
- **Verde Éxito:** `#28a745` (Mensajes de éxito, requisitos cumplidos)
- **Rojo Error:** `#dc3545` (Mensajes de error)
- **Gris Fondo:** `#f8f9fa` (Fondos)
- **Azul Acento:** `#007bff` (Acentos)

---

## 📝 Notas Importantes

1. **Datos Temporales:** Los datos de productos y usuarios están en memoria. Se pierden al recargar.
2. **Validación:** La validación de login está únicamente en el frontend. El backend debe validar credenciales.
3. **Seguridad:** Las contraseñas no se deben almacenar así en producción. Implementar hash en backend.
4. **API:** El servicio `ProductoService` está listo para conectar, pero aún no tiene implementados los métodos HTTP.

---

## 🐛 Problemas Conocidos

- [ ] El servicio ProductoService no tiene métodos implementados
- [ ] No hay persistencia de datos
- [ ] No hay autenticación real (solo frontend)
- [ ] Faltan pruebas unitarias

---

## 📞 Soporte y Contacto

Para más información sobre cómo continuar con el desarrollo:

1. Conectar con API backend
2. Implementar autenticación JWT
3. Agregar más funcionalidades

---

**Última actualización:** Junio 2026
**Autor:** Equipo de Desarrollo MEAN
