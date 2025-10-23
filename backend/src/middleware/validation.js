/**
 * Middleware para validación de requests usando Joi
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: error.details.map(detail => detail.message)
      });
    }

    // Reemplazar req.body con los datos validados y limpiados
    req.body = value;
    next();
  };
};

module.exports = {
  validateRequest
};
