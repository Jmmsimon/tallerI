import axios from 'axios';

const SEMANTIC_SCHOLAR_API = 'https://api.semanticscholar.org/graph/v1/paper/search';

/**
 * Busca papers en Semantic Scholar
 * @param {Object} params - Parámetros de búsqueda
 * @param {string} params.searchQuery - Query de búsqueda
 * @param {number} params.limit - Número de resultados
 * @param {string} params.year - Año específico (opcional)
 * @returns {Promise<Object>} Resultados
 */
export const searchSemanticScholar = async (params) => {
  try {
    const { searchQuery, limit = 25, year } = params;
    
    // Construir parámetros de la búsqueda
    const searchParams = {
      query: searchQuery,
      limit: limit,
      fields: 'title,authors,year,abstract,url,citationCount,venue,openAccessPdf'
    };
    
    // Si hay filtro por año, agregarlo a la query
    if (year) {
      // Semantic Scholar usa la fecha en el formato year:YEAR
      // Pero eso no está disponible directamente, así que filtraremos después
    }
    
    const response = await axios.get(SEMANTIC_SCHOLAR_API, {
      params: searchParams,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const results = response.data.data || [];
    
    // Formatear resultados
    const formattedResults = results.map(paper => ({
      id: paper.paperId || paper.id || '',
      title: paper.title || 'Sin título',
      authors: paper.authors?.map(a => a.name).join(', ') || 'Autor desconocido',
      authorsList: paper.authors?.map(a => a.name) || [],
      summary: paper.abstract || '',
      year: paper.year || new Date().getFullYear(),
      month: 1,
      day: 1,
      published: paper.year ? `${paper.year}-01-01` : new Date().toISOString().split('T')[0],
      category: paper.venue || 'Semantic Scholar',
      pdf: paper.openAccessPdf?.url || '',
      url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId || paper.id}`,
      doi: paper.doi || '',
      source: 'Semantic Scholar',
      citationCount: paper.citationCount || 0,
      venue: paper.venue || ''
    }));
    
    // Filtrar por año si se especifica
    const filteredResults = year ? formattedResults.filter(p => p.year === parseInt(year)) : formattedResults;
    
    return {
      success: true,
      totalResults: response.data.total || results.length,
      results: filteredResults,
      query: searchQuery
    };
    
  } catch (error) {
    console.error('Error buscando en Semantic Scholar:', error);
    throw new Error(error.response?.data?.message || error.message || 'Error al buscar en Semantic Scholar');
  }
};

