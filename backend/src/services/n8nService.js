const axios = require('axios');

class N8nService {
  constructor() {
    this.baseURL = process.env.N8N_BASE_URL || 'http://localhost:5678';
    this.apiKey = process.env.N8N_API_KEY;
    this.workflowId = process.env.N8N_WORKFLOW_ID;
    
    // Configuración de axios
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 segundos
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': this.apiKey
      }
    });
  }

  /**
   * Ejecuta una búsqueda de papers científicos usando n8n
   * @param {Object} searchParams - Parámetros de búsqueda
   * @param {string} searchParams.topic - Tema de búsqueda
   * @param {number} searchParams.startYear - Año de inicio
   * @param {number} searchParams.endYear - Año de fin
   * @param {number} searchParams.maxResults - Máximo número de resultados
   * @returns {Promise<Object>} Resultados de la búsqueda
   */
  async searchPapers(searchParams) {
    try {
      const { topic, startYear, endYear, maxResults = 50 } = searchParams;

      // Validar parámetros requeridos
      if (!topic) {
        throw new Error('El parámetro "topic" es requerido');
      }

      if (!startYear || !endYear) {
        throw new Error('Los parámetros "startYear" y "endYear" son requeridos');
      }

      if (startYear > endYear) {
        throw new Error('El año de inicio no puede ser mayor al año de fin');
      }

      // Preparar datos para enviar a n8n
      const workflowData = {
        topic: topic.trim(),
        startYear: parseInt(startYear),
        endYear: parseInt(endYear),
        maxResults: parseInt(maxResults),
        timestamp: new Date().toISOString()
      };

      console.log('🔍 Ejecutando búsqueda en n8n:', workflowData);

      // Ejecutar workflow de n8n
      const response = await this.client.post(`/api/v1/workflows/${this.workflowId}/execute`, {
        data: workflowData
      });

      // Procesar respuesta de n8n
      const results = this.processN8nResponse(response.data);

      console.log(`✅ Búsqueda completada: ${results.papers.length} papers encontrados`);

      return {
        success: true,
        data: results,
        metadata: {
          searchParams: workflowData,
          timestamp: new Date().toISOString(),
          totalResults: results.papers.length
        }
      };

    } catch (error) {
      console.error('❌ Error en búsqueda n8n:', error.message);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        // Error de respuesta HTTP
        const status = error.response.status;
        const message = error.response.data?.message || 'Error en la respuesta del servidor';
        
        throw new Error(`Error ${status}: ${message}`);
      } else if (error.request) {
        // Error de conexión
        throw new Error('No se pudo conectar con el servicio n8n');
      } else {
        // Otros errores
        throw new Error(`Error interno: ${error.message}`);
      }
    }
  }

  /**
   * Procesa la respuesta de n8n y la convierte al formato esperado
   * @param {Object} n8nResponse - Respuesta cruda de n8n
   * @returns {Object} Datos procesados
   */
  processN8nResponse(n8nResponse) {
    try {
      // Extraer datos del workflow ejecutado
      const executionData = n8nResponse.data || n8nResponse;
      
      // Buscar el nodo que contiene los resultados de papers
      let papers = [];
      let searchInfo = {};

      if (executionData && Array.isArray(executionData)) {
        // Buscar en los datos de ejecución
        for (const node of executionData) {
          if (node.data && node.data.papers) {
            papers = node.data.papers;
          }
          if (node.data && node.data.searchInfo) {
            searchInfo = node.data.searchInfo;
          }
        }
      } else if (executionData.papers) {
        papers = executionData.papers;
        searchInfo = executionData.searchInfo || {};
      }

      // Validar y formatear papers
      const formattedPapers = papers.map((paper, index) => ({
        id: paper.id || `paper_${index}`,
        year: paper.year || new Date().getFullYear(),
        title: paper.title || 'Título no disponible',
        authors: paper.authors || 'Autor no disponible',
        doi: paper.doi || '',
        url: paper.url || paper.link || '',
        source: paper.source || paper.journal || 'Fuente no disponible',
        pdf: paper.pdf || paper.pdfUrl || '',
        abstract: paper.abstract || '',
        keywords: paper.keywords || [],
        citationCount: paper.citationCount || 0,
        impactFactor: paper.impactFactor || null
      }));

      return {
        papers: formattedPapers,
        searchInfo: {
          query: searchInfo.query || '',
          totalFound: searchInfo.totalFound || formattedPapers.length,
          searchTime: searchInfo.searchTime || new Date().toISOString(),
          sources: searchInfo.sources || []
        }
      };

    } catch (error) {
      console.error('Error procesando respuesta de n8n:', error);
      
      // Retornar estructura básica en caso de error
      return {
        papers: [],
        searchInfo: {
          query: '',
          totalFound: 0,
          searchTime: new Date().toISOString(),
          sources: []
        }
      };
    }
  }

  /**
   * Obtiene información del estado del workflow de n8n
   * @returns {Promise<Object>} Estado del workflow
   */
  async getWorkflowStatus() {
    try {
      const response = await this.client.get(`/api/v1/workflows/${this.workflowId}`);
      
      return {
        success: true,
        data: {
          id: response.data.id,
          name: response.data.name,
          active: response.data.active,
          nodes: response.data.nodes?.length || 0,
          lastExecuted: response.data.updatedAt
        }
      };
    } catch (error) {
      console.error('Error obteniendo estado del workflow:', error);
      throw new Error('No se pudo obtener el estado del workflow');
    }
  }

  /**
   * Valida la configuración del servicio
   * @returns {Object} Estado de la configuración
   */
  validateConfig() {
    const issues = [];
    
    if (!this.baseURL) {
      issues.push('N8N_BASE_URL no está configurado');
    }
    
    if (!this.apiKey) {
      issues.push('N8N_API_KEY no está configurado');
    }
    
    if (!this.workflowId) {
      issues.push('N8N_WORKFLOW_ID no está configurado');
    }

    return {
      isValid: issues.length === 0,
      issues: issues,
      config: {
        baseURL: this.baseURL,
        hasApiKey: !!this.apiKey,
        hasWorkflowId: !!this.workflowId
      }
    };
  }
}

module.exports = new N8nService();
