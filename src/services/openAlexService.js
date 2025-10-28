import axios from 'axios';

const OPENALEX_API = 'https://api.openalex.org/works';

/**
 * Busca papers en OpenAlex
 * @param {Object} params - Parámetros de búsqueda
 * @param {string} params.searchQuery - Query de búsqueda
 * @param {number} params.limit - Número de resultados
 * @param {number} params.startYear - Año de inicio (opcional)
 * @param {number} params.endYear - Año final (opcional)
 * @returns {Promise<Object>} Resultados
 */
export const searchOpenAlex = async (params) => {
  try {
    const { searchQuery, limit = 25, startYear, endYear } = params;
    
    // Construir el filtro de búsqueda
    let searchParam = `"${searchQuery}"`;
    
    // Construir parámetros de la query
    const searchParams = {
      search: searchParam,
      per_page: limit,
      page: 1
    };
    
    // Agregar filtro de rango de años si se especifica
    if (startYear && endYear) {
      // Si ambos años son iguales, usar un solo año
      if (parseInt(startYear) === parseInt(endYear)) {
        searchParams.filter = `publication_year:${startYear}`;
      } else {
        // OpenAlex no soporta rangos directamente, así que usamos solo el rango básico
        // y filtraremos después en el código
        searchParams.filter = `publication_year:>=${startYear},publication_year:<=${endYear}`;
      }
    }
    
    const response = await axios.get(OPENALEX_API, {
      params: searchParams
    });
    
    const results = response.data.results || [];
    
    // Formatear resultados para que coincidan con el formato de ArXiv
    const formattedResults = results.map(work => {
      // Extraer año de la fecha de publicación
      const pubYear = work.publication_date ? parseInt(work.publication_date.split('-')[0]) : 
                     work.publication_year || new Date().getFullYear();
      
      // Formatear autores
      const authors = work.authorships?.map(a => a.author?.display_name || 'Unknown').join(', ') || 'Autor desconocido';
      const authorsList = work.authorships?.map(a => a.author?.display_name || 'Unknown') || [];
      
      return {
        id: work.id?.split('/').pop() || '',
        openAlexId: work.id,
        title: work.title || 'Sin título',
        authors: authors,
        authorsList: authorsList,
        summary: work.abstract || '',
        year: pubYear,
        month: work.publication_date ? parseInt(work.publication_date.split('-')[1]) || 1 : 1,
        day: work.publication_date ? parseInt(work.publication_date.split('-')[2]) || 1 : 1,
        published: work.publication_date || `${pubYear}-01-01`,
        category: work.primary_location?.source?.display_name || work.type || 'OpenAlex',
        pdf: work.open_access?.oa_url || '',
        url: work.primary_location?.landing_page_url || work.id || '',
        doi: work.doi || '',
        source: 'OpenAlex',
        citationCount: work.cited_by_count || 0,
        venue: work.primary_location?.source?.display_name || ''
      };
    });
    
    return {
      success: true,
      totalResults: response.data.count || results.length,
      results: formattedResults,
      query: searchQuery
    };
    
  } catch (error) {
    console.error('Error buscando en OpenAlex:', error);
    throw new Error(error.response?.data?.message || error.message || 'Error al buscar en OpenAlex');
  }
};

