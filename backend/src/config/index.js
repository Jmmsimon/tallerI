const path = require('path');

const config = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development'
  },

  // Configuración de n8n
  n8n: {
    baseURL: process.env.N8N_BASE_URL || 'http://localhost:5678',
    apiKey: process.env.N8N_API_KEY,
    workflowId: process.env.N8N_WORKFLOW_ID,
    timeout: parseInt(process.env.N8N_TIMEOUT) || 30000
  },

  // Configuración de CORS
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // Configuración de rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
      error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
    }
  },

  // Configuración de logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
  },

  // Configuración de validación
  validation: {
    maxResults: {
      min: 1,
      max: 1000,
      default: 50
    },
    yearRange: {
      min: 1900,
      max: new Date().getFullYear()
    },
    topicLength: {
      min: 2,
      max: 200
    }
  },

  // Configuración de seguridad
  security: {
    helmet: {
      contentSecurityPolicy: false, // Deshabilitado para desarrollo
      crossOriginEmbedderPolicy: false
    }
  }
};

module.exports = config;
