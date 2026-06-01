# 🔐 Guía: HttpOnly Cookies con JWT en TechStore Backend

## ✅ Cambios Implementados

El backend ha sido configurado para usar **HttpOnly Cookies** en autenticación JWT. Esto mejora significativamente la seguridad al proteger contra ataques XSS (Cross-Site Scripting).

---

## 1️⃣ CORS Configuration (`src/config/corsConfig.js`)

```javascript
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || WHITELIST.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true, // ✅ IMPORTANTE: permite cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-XSRF-TOKEN"],
  exposedHeaders: ["X-XSRF-TOKEN"], // ✅ Expone headers para el cliente
  maxAge: 3600, // Cache preflight: 1 hora
};
```

**Cambios clave:**

- ✅ `credentials: true` → Permite envío y recepción de cookies
- ✅ `allowedHeaders: ['X-XSRF-TOKEN']` → Soporte para tokens CSRF
- ✅ `exposedHeaders: ['X-XSRF-TOKEN']` → El cliente puede acceder a estos headers

---

## 2️⃣ Controllers (`src/controllers/auth.controller.js`)

### Configuración de la Cookie HttpOnly

#### En `registro()` y `login()`:

```javascript
// Generar JWT
const token = jwt.sign(
  { id: usuario._id, correo: usuario.correo },
  process.env.JWT_SECRET || "tu_clave_secreta_aqui",
  { expiresIn: "7d" },
);

// ✅ Configurar cookie HttpOnly
res.cookie("token", token, {
  httpOnly: true, // No accesible desde JavaScript (protege contra XSS)
  secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
  sameSite: "Lax", // Protección contra CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
  path: "/", // Disponible en toda la aplicación
});

// ✅ NO enviar token en el body (ya está en la cookie)
res.status(200).json({
  ok: true,
  mensaje: "Login exitoso",
  usuario: {
    /* ... */
  },
  // ✅ El 'token' NO se envía aquí - está en la cookie HttpOnly
});
```

### Nuevo Endpoint: Logout

```javascript
exports.logout = catchAsync(async (req, res, next) => {
  // ✅ Limpiar la cookie del token
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
  });

  res.status(200).json({
    ok: true,
    mensaje: "Sesión cerrada exitosamente",
  });
});
```

**Endpoint:** `POST /api/auth/logout`

- Requiere: Token en cookie (automático)
- Limpia: La cookie del navegador

---

## 3️⃣ Auth Middleware (`src/middleware/auth.middleware.js`)

```javascript
exports.verificarToken = (req, res, next) => {
  try {
    // ✅ Obtener token del header Authorization O de cookies
    let token = req.headers.authorization?.split(" ")[1];

    // Si no está en el header, intentar obtener de las cookies
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        ok: false,
        mensaje: "Token no proporcionado",
      });
    }

    // Verificar y decodificar
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "tu_clave_secreta_aqui",
    );

    req.usuario = decoded;
    next();
  } catch (error) {
    // Manejo de errores...
  }
};
```

**Cambios clave:**

- ✅ Busca primero en `Authorization` header (para APIs externas)
- ✅ Si no existe, busca en `req.cookies.token` (para SPA con credentials)
- ✅ Compatible con ambos métodos de autenticación

---

## 4️⃣ Auth Routes (`src/routes/auth.routes.js`)

Se agregó el nuevo endpoint:

```javascript
// POST /api/auth/logout
// Requiere token JWT (en cookie o header)
router.post("/logout", authMiddleware.verificarToken, authController.logout);
```

---

## 🔧 Configuración en el Frontend (Angular)

Ya tienes configurado `withCredentials: true`, que es lo correcto:

```typescript
// ✅ En los interceptores HTTP
{
  provide: HTTP_INTERCEPTORS,
  useClass: CredentialsInterceptor,
  multi: true
}

// Cada request incluye las cookies automáticamente
return next.handle(req.clone({ withCredentials: true })).pipe(...);
```

**Resultado:** El navegador automáticamente:

1. Envía cookies en cada request (gracias a `withCredentials: true`)
2. Recibe nuevas cookies en las respuestas
3. Las cookies no son accesibles desde JavaScript (protección XSS)

---

## 📊 Flujo de Autenticación

### Login:

```
1. Frontend hace POST /api/auth/login
   ↓
2. Backend verifica credenciales ✓
   ↓
3. Backend genera JWT y lo envía en cookie HttpOnly
   → Set-Cookie: token=eyJ...; HttpOnly; Secure; SameSite=Lax
   ↓
4. Frontend recibe respuesta con datos de usuario
   ↓
5. Navegador almacena cookie automáticamente
```

### Petición Autenticada:

```
1. Frontend hace GET /api/auth/perfil
   → Navegador envía automáticamente: Cookie: token=eyJ...
   ↓
2. Backend recibe cookie en req.cookies.token
   ↓
3. Auth middleware verifica el token
   ↓
4. Endpoint responde con datos del usuario
```

### Logout:

```
1. Frontend hace POST /api/auth/logout
   → Navegador envía: Cookie: token=eyJ...
   ↓
2. Backend limpia la cookie: res.clearCookie('token')
   → Set-Cookie: token=; expires=Thu, 01 Jan 1970
   ↓
3. Navegador elimina la cookie
   ↓
4. Futuras peticiones NO incluyen el token
```

---

## 🛡️ Beneficios de Seguridad

| Aspecto              | HttpOnly Cookies              | Token en localStorage      |
| -------------------- | ----------------------------- | -------------------------- |
| **Protección XSS**   | ✅ Sí (no accesible desde JS) | ❌ No (vulnerable)         |
| **Protección CSRF**  | ✅ Sí (SameSite=Lax)          | ⚠️ Requiere implementación |
| **Envío automático** | ✅ Sí (navegador)             | ❌ No (manual)             |
| **Acceso desde JS**  | ❌ No (seguridad)             | ✅ Sí                      |

---

## 🧪 Pruebas desde Postman/REST Client

### Login:

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "correo": "usuario@example.com",
  "contrasena": "miPassword123"
}
```

**Respuesta esperada:**

```
201 Created
Set-Cookie: token=eyJ...; Path=/; HttpOnly; SameSite=Lax
```

### Petición Autenticada:

```
GET http://localhost:3000/api/auth/perfil
Cookie: token=eyJ...
```

**Nota:** En Postman, enable "Automatically follow redirects" y las cookies se manejan automáticamente.

### Logout:

```
POST http://localhost:3000/api/auth/logout
Cookie: token=eyJ...
```

**Respuesta esperada:**

```
200 OK
Set-Cookie: token=; Path=/; HttpOnly; SameSite=Lax; expires=1970-01-01
```

---

## ⚙️ Variables de Entorno Necesarias

En `.env`:

```env
# Base de datos
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/techstore

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui

# Entorno
NODE_ENV=development  # Cambiar a "production" en deploy
PORT=3000

# Frontend origin (para CORS)
FRONTEND_URL=http://localhost:4200
```

---

## 🚀 Deploy en Producción

### Cambios necesarios:

1. **Secure flag en cookies:**

   ```javascript
   secure: process.env.NODE_ENV === "production"; // true en prod
   ```

   - Requiere **HTTPS** obligatoriamente

2. **Actualizar CORS whitelist** (`src/config/corsConfig.js`):

   ```javascript
   const WHITELIST = [
     "https://tudominio.com", // Tu frontend en producción
     "https://api.tudominio.com", // Tu backend en producción
   ];
   ```

3. **Variables de entorno en producción:**
   ```env
   NODE_ENV=production
   JWT_SECRET=una_clave_muy_segura_y_unica
   MONGODB_URI=tu_string_de_conexion_seguro
   ```

---

## 📝 Resumen de Cambios

| Archivo                              | Cambios                                                                             |
| ------------------------------------ | ----------------------------------------------------------------------------------- |
| `src/config/corsConfig.js`           | ✅ Agregados `allowedHeaders` y `exposedHeaders` para XSRF                          |
| `src/controllers/auth.controller.js` | ✅ JWT enviado en HttpOnly cookie en `registro()` y `login()` / ✅ Nuevo `logout()` |
| `src/middleware/auth.middleware.js`  | ✅ Busca token en cookies como fallback                                             |
| `src/routes/auth.routes.js`          | ✅ Nueva ruta `POST /api/auth/logout`                                               |

---

## ✨ Próximos Pasos Opcionales

1. **CSRF Protection:** Implementar tokens CSRF si es necesario
2. **Refresh Tokens:** Usar refresh tokens con HttpOnly cookies separadas
3. **Session Store:** Redis para invalidar sesiones en tiempo real
4. **2FA:** Autenticación de dos factores
5. **Audit Logs:** Registrar intentos de login y cambios de sesión
