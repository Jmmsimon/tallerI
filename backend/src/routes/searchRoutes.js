const express = require('express');
const Joi = require('joi');
const n8nService = require('../services/n8nService');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// Esquema de validación para búsquedas
const searchSchema = Joi.object({
  topic: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'El tema debe tener al menos 2 caracteres',
      'string.max': 'El tema no puede exceder 200 caracteres',
      'any.required': 'El tema es requerido'
    }),
  startYear: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages({
      'number.min': 'El año de inicio debe ser mayor a 1900',
      'number.max': 'El año de inicio no puede ser mayor al año actual',
      'any.required': 'El año de inicio es requerido'
    }),
  endYear: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages({
      'number.min': 'El año de fin debe ser mayor a 1900',
      'number.max': 'El año de fin no puede ser mayor al año actual',
      'any.required': 'El año de fin es requerido'
    }),
  maxResults: Joi.number()
    .integer()
    .min(1)
    .max(1000)
    .default(50)
    .messages({
      'number.min': 'El máximo de resultados debe ser al menos 1',
      'number.max': 'El máximo de resultados no puede exceder 1000'
    })
});

/**
 * POST /api/search/papers
 * Realiza una búsqueda de papers científicos
 */
router.post('/papers', validateRequest(searchSchema), async (req, res, next) => {
  try {
    const { topic, startYear, endYear, maxResults } = req.body;

    console.log(`🔍 Iniciando búsqueda: "${topic}" (${startYear}-${endYear})`);

    // Validar configuración de n8n
    const configStatus = n8nService.validateConfig();
    if (!configStatus.isValid) {
      return res.status(500).json({
        success: false,
        error: 'Configuración de n8n incompleta',
        details: configStatus.issues
      });
    }

    // Ejecutar búsqueda
    const results = await n8nService.searchPapers({
      topic,
      startYear,
      endYear,
      maxResults
    });

    res.status(200).json({
      success: true,
      message: 'Búsqueda completada exitosamente',
      ...results
    });

  } catch (error) {
    console.error('Error en búsqueda de papers:', error);
    next(error);
  }
});

/**
 * GET /api/search/papers
 * Realiza una búsqueda de papers usando query parameters
 */
router.get('/papers', async (req, res, next) => {
  try {
    const { topic, startYear, endYear, maxResults } = req.query;

    // Validar parámetros de query
    const validation = searchSchema.validate({
      topic,
      startYear: startYear ? parseInt(startYear) : undefined,
      endYear: endYear ? parseInt(endYear) : undefined,
      maxResults: maxResults ? parseInt(maxResults) : undefined
    });

    if (validation.error) {
      return res.status(400).json({
        success: false,
        error: 'Parámetros de búsqueda inválidos',
        details: validation.error.details.map(detail => detail.message)
      });
    }

    const searchParams = validation.value;

    console.log(`🔍 Iniciando búsqueda GET: "${searchParams.topic}" (${searchParams.startYear}-${searchParams.endYear})`);

    // Validar configuración de n8n
    const configStatus = n8nService.validateConfig();
    if (!configStatus.isValid) {
      return res.status(500).json({
        success: false,
        error: 'Configuración de n8n incompleta',
        details: configStatus.issues
      });
    }

    // Ejecutar búsqueda
    const results = await n8nService.searchPapers(searchParams);

    res.status(200).json({
      success: true,
      message: 'Búsqueda completada exitosamente',
      ...results
    });

  } catch (error) {
    console.error('Error en búsqueda GET de papers:', error);
    next(error);
  }
});

/**
 * GET /api/search/status
 * Obtiene el estado del workflow de n8n
 */
router.get('/status', async (req, res, next) => {
  try {
    const status = await n8nService.getWorkflowStatus();
    
    res.status(200).json({
      success: true,
      message: 'Estado del workflow obtenido',
      ...status
    });

  } catch (error) {
    console.error('Error obteniendo estado del workflow:', error);
    next(error);
  }
});

/**
 * GET /api/search/config
 * Obtiene información de configuración (sin datos sensibles)
 */
router.get('/config', (req, res) => {
  const configStatus = n8nService.validateConfig();
  
  res.status(200).json({
    success: true,
    message: 'Estado de configuración',
    data: {
      isValid: configStatus.isValid,
      issues: configStatus.issues,
      config: {
        hasBaseURL: !!configStatus.config.baseURL,
        hasApiKey: configStatus.config.hasApiKey,
        hasWorkflowId: configStatus.config.hasWorkflowId
      }
    }
  });
});

/**
 * POST /api/search/test
 * Endpoint de prueba para verificar la conectividad con n8n
 */
router.post('/test', async (req, res, next) => {
  try {
    // Datos de prueba
    const testParams = {
      topic: 'machine learning',
      startYear: 2023,
      endYear: 2024,
      maxResults: 5
    };

    console.log('🧪 Ejecutando prueba de conectividad con n8n');

    const results = await n8nService.searchPapers(testParams);

    res.status(200).json({
      success: true,
      message: 'Prueba de conectividad exitosa',
      testParams,
      ...results
    });

  } catch (error) {
    console.error('Error en prueba de conectividad:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error en prueba de conectividad',
      message: error.message,
      testParams: {
        topic: 'machine learning',
        startYear: 2023,
        endYear: 2024,
        maxResults: 5
      }
    });
  }
});

module.exports = router;
