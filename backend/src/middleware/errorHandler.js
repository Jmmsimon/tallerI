/**
 * Middleware para manejo de errores globales
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error capturado:', err);

  // Error de validación de Joi
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.details.map(detail => detail.message)
    });
  }

  // Error de conexión con n8n
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      success: false,
      error: 'Servicio no disponible',
      message: 'No se pudo conectar con el servicio n8n'
    });
  }

  // Error de timeout
  if (err.code === 'ECONNABORTED') {
    return res.status(408).json({
      success: false,
      error: 'Timeout',
      message: 'La solicitud tardó demasiado tiempo en procesarse'
    });
  }

  // Error de axios
  if (err.response) {
    const status = err.response.status;
    const message = err.response.data?.message || 'Error en la respuesta del servidor';
    
    return res.status(status).json({
      success: false,
      error: `Error ${status}`,
      message: message
    });
  }

  // Error interno del servidor
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
};

module.exports = {
  errorHandler
};
