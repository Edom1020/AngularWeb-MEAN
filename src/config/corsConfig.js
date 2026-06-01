// ─────────────────────────────────────────────
// CONFIGURACIÓN SEGURA DE CORS
// ─────────────────────────────────────────────

// Whitelist de orígenes permitidos
const WHITELIST = [
  'http://localhost:4200',        // Angular local
  'http://localhost:3000',        // Backend local
  'http://localhost:3001',        // Alternativa local
  'https://techstore.vercel.app', // Frontend en Vercel
  'https://techstore-api.render.com', // Backend en Render
];

// En producción, agregar orígenes reales
if (process.env.NODE_ENV === 'production') {
  // WHITELIST.push('https://midominio.com');
}

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (como mobile apps, curl, etc)
    if (!origin || WHITELIST.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true, // IMPORTANTE: permitir cookies (HttpOnly)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-XSRF-TOKEN'],
  exposedHeaders: ['X-XSRF-TOKEN'], // Exponer headers para el cliente
  maxAge: 3600 // Cache de preflight por 1 hora
};

module.exports = corsOptions;
