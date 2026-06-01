const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');
const { AppError, catchAsync } = require('../middleware/errorHandler.middleware');

// ─────────────────────────────────────────────
// REGISTRO DE USUARIO
// ─────────────────────────────────────────────
exports.registro = catchAsync(async (req, res, next) => {
  const { nombreCompleto, correo, contrasena, confirmarContrasena } = req.body;

  // Validaciones ya hechas por express-validator
  // Verificar si el usuario ya existe
  const usuarioExistente = await Usuario.findOne({ correo: correo.toLowerCase() });
  if (usuarioExistente) {
    return next(new AppError('El correo ya está registrado', 409));
  }

  // Hashear la contraseña
  const salt = await bcrypt.genSalt(10);
  const contrasenaHasheada = await bcrypt.hash(contrasena, salt);

  // Crear nuevo usuario
  const nuevoUsuario = await Usuario.create({
    nombreCompleto,
    correo: correo.toLowerCase(),
    contrasena: contrasenaHasheada
  });

  // Generar JWT
  const token = jwt.sign(
    { id: nuevoUsuario._id, correo: nuevoUsuario.correo },
    process.env.JWT_SECRET || 'tu_clave_secreta_aqui',
    { expiresIn: '7d' }
  );

  // Configurar cookie HttpOnly
  res.cookie('token', token, {
    httpOnly: true,        // No accesible desde JavaScript (protege contra XSS)
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: 'Lax',      // Protección contra CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    path: '/'             // Disponible en toda la aplicación
  });

  res.status(201).json({
    ok: true,
    mensaje: 'Usuario registrado exitosamente',
    usuario: {
      id: nuevoUsuario._id,
      nombreCompleto: nuevoUsuario.nombreCompleto,
      correo: nuevoUsuario.correo
    }
  });
});

// ─────────────────────────────────────────────
// LOGIN DE USUARIO
// ─────────────────────────────────────────────
exports.login = catchAsync(async (req, res, next) => {
  const { correo, contrasena } = req.body;

  // Buscar usuario por correo (incluye contraseña con +select)
  const usuario = await Usuario.findOne({ correo: correo.toLowerCase() }).select('+contrasena');

  if (!usuario) {
    // Mensaje genérico para no revelar si el usuario existe
    return next(new AppError('Correo o contraseña incorrectos', 401));
  }

  // Comparar contraseña
  const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

  if (!contrasenaValida) {
    return next(new AppError('Correo o contraseña incorrectos', 401));
  }

  // Generar JWT
  const token = jwt.sign(
    { id: usuario._id, correo: usuario.correo },
    process.env.JWT_SECRET || 'tu_clave_secreta_aqui',
    { expiresIn: '7d' }
  );

  // Configurar cookie HttpOnly
  res.cookie('token', token, {
    httpOnly: true,        // No accesible desde JavaScript (protege contra XSS)
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: 'Lax',      // Protección contra CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    path: '/'             // Disponible en toda la aplicación
  });

  res.status(200).json({
    ok: true,
    mensaje: 'Login exitoso',
    usuario: {
      id: usuario._id,
      nombreCompleto: usuario.nombreCompleto,
      correo: usuario.correo
    }
  });
});

// ─────────────────────────────────────────────
// VERIFICAR SI EL CORREO EXISTE (RESPUESTA INMEDIATA)
// ─────────────────────────────────────────────
exports.verificarCorreo = catchAsync(async (req, res, next) => {
  const { correo } = req.query;

  // Búsqueda rápida sin seleccionar campos innecesarios
  const existe = await Usuario.findOne({ correo: correo.toLowerCase() }).select('_id');

  if (existe) {
    return res.status(200).json({
      ok: false,
      existe: true,
      mensaje: 'El correo ya está registrado'
    });
  }

  res.status(200).json({
    ok: true,
    existe: false,
    mensaje: 'El correo está disponible'
  });
});

// ─────────────────────────────────────────────
// OBTENER PERFIL DEL USUARIO (REQUIERE TOKEN)
// ─────────────────────────────────────────────
exports.obtenerPerfil = catchAsync(async (req, res, next) => {
  const usuario = await Usuario.findById(req.usuario.id);

  if (!usuario) {
    return next(new AppError('Usuario no encontrado', 404));
  }

  res.status(200).json({
    ok: true,
    usuario: {
      id: usuario._id,
      nombreCompleto: usuario.nombreCompleto,
      correo: usuario.correo,
      fechaRegistro: usuario.fechaRegistro
    }
  });
});

// ─────────────────────────────────────────────
// LOGOUT - LIMPIAR COOKIE HTTPONLY
// ─────────────────────────────────────────────
exports.logout = catchAsync(async (req, res, next) => {
  // Limpiar la cookie del token
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/'
  });

  res.status(200).json({
    ok: true,
    mensaje: 'Sesión cerrada exitosamente'
  });
});
