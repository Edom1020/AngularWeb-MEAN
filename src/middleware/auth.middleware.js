const jwt = require('jsonwebtoken');

// Middleware para verificar JWT
exports.verificarToken = (req, res, next) => {
  try {
    // Obtener el token del header Authorization o de las cookies
    let token = req.headers.authorization?.split(' ')[1]; // "Bearer token_aqui"
    
    // Si no está en el header, intentar obtener de las cookies (HttpOnly)
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Token no proporcionado'
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'tu_clave_secreta_aqui'
    );

    // Guardar los datos del usuario en req para usarlos después
    req.usuario = decoded;

    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        mensaje: 'El token ha expirado'
      });
    }

    res.status(401).json({
      ok: false,
      mensaje: 'Token inválido',
      error: error.message
    });
  }
};
