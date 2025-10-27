import axios from 'axios';

// API de ArXiv - Documentación: https://arxiv.org/help/api/user-manual
const ARXIV_API_BASE = 'https://export.arxiv.org/api/query';

/**
 * Busca papers científicos en ArXiv
 * @param {Object} params - Parámetros de búsqueda
 * @param {string} params.searchQuery - Término de búsqueda
 * @param {number} params.start - Índice de inicio (para paginación)
 * @param {number} params.maxResults - Número máximo de resultados
 * @returns {Promise<Object>} Objeto con los resultados
 */
export const searchArxiv = async (params) => {
  try {
    const { searchQuery = '', start = 0, maxResults = 50 } = params;
    
    // Construir la query de búsqueda para ArXiv
    // ArXiv usa campos de búsqueda: ti (título), au (autor), abs (abstract), all (todo)
    // Formato: search_query=all:TERM
    const arxivQuery = `all:${encodeURIComponent(searchQuery)}`;
    
    const response = await axios.get(ARXIV_API_BASE, {
      params: {
        search_query: arxivQuery,
        start: start,
        max_results: maxResults,
        sortBy: 'submittedDate',
        sortOrder: 'descending'
      }
    });

    // Parsear el XML de respuesta
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, 'text/xml');
    
    // Extraer entradas
    const entries = xmlDoc.getElementsByTagName('entry');
    const results = Array.from(entries).map(entry => {
      // Extraer información de cada paper
      const id = entry.getElementsByTagName('id')[0]?.textContent || '';
      const title = entry.getElementsByTagName('title')[0]?.textContent?.replace(/\n/g, ' ').trim() || '';
      const summary = entry.getElementsByTagName('summary')[0]?.textContent?.replace(/\n/g, ' ').trim() || '';
      const published = entry.getElementsByTagName('published')[0]?.textContent || '';
      const updated = entry.getElementsByTagName('updated')[0]?.textContent || '';
      
      // Extraer autores
      const authors = Array.from(entry.getElementsByTagName('author'))
        .map(author => {
          const nameNode = author.getElementsByTagName('name')[0];
          return nameNode?.textContent || '';
        })
        .filter(name => name);
      
      // Extraer categorías (arxiv:primary_category)
      const primaryCategory = entry.getElementsByTagName('arxiv:primary_category')[0]?.getAttribute('term') || '';
      
      // Extraer links (PDF, DOI, etc.)
      const links = Array.from(entry.getElementsByTagName('link'));
      const pdfLink = links.find(link => link.getAttribute('type') === 'application/pdf')?.getAttribute('href') || '';
      const absLink = links.find(link => link.getAttribute('type') === 'text/html')?.getAttribute('href') || '';
      
      // Extraer año de la fecha de publicación
      // ArXiv fecha está en formato: 2025-10-24T17:59:47Z
      const publishedDate = new Date(published);
      let year, month, day;
      
      // Verificar si la fecha es válida
      if (isNaN(publishedDate.getTime())) {
        // Si la fecha no es válida, intentar parsear manualmente
        const dateMatch = published.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (dateMatch) {
          year = parseInt(dateMatch[1]);
          month = parseInt(dateMatch[2]);
          day = parseInt(dateMatch[3]);
        } else {
          // Si no hay fecha, usar la fecha actual
          year = new Date().getFullYear();
          month = new Date().getMonth() + 1;
          day = new Date().getDate();
        }
      } else {
        year = publishedDate.getFullYear();
        month = publishedDate.getMonth() + 1;
        day = publishedDate.getDate();
      }
      
      // Construir DOI (si existe)
      const doi = entry.getElementsByTagName('arxiv:doi')[0]?.textContent || '';
      const arxivId = id.split('/').pop() || '';
      
      return {
        id: arxivId,
        arxivId,
        title,
        authors: authors.join(', '),
        authorsList: authors,
        summary,
        year,
        month,
        day,
        published: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        category: primaryCategory,
        pdf: pdfLink,
        url: absLink || `https://arxiv.org/abs/${arxivId}`,
        doi: doi || `arXiv:${arxivId}`,
        source: 'ArXiv'
      };
    });

    // Obtener total de resultados
    const totalResultsElement = xmlDoc.getElementsByTagName('opensearch:totalResults')[0];
    const totalResults = totalResultsElement ? parseInt(totalResultsElement.textContent) : results.length;

    return {
      success: true,
      totalResults,
      results,
      query: searchQuery
    };

  } catch (error) {
    console.error('Error buscando en ArXiv:', error);
    throw new Error(error.response?.data?.message || error.message || 'Error al buscar en ArXiv');
  }
};

/**
 * Filtra los resultados por año
 * @param {Array} results - Array de resultados
 * @param {number} startYear - Año de inicio
 * @param {number} endYear - Año de fin
 * @returns {Array} Resultados filtrados
 */
export const filterByYear = (results, startYear, endYear) => {
  if (!startYear || !endYear) return results;
  
  const start = parseInt(startYear);
  const end = parseInt(endYear);
  const currentYear = new Date().getFullYear();
  
  // Primero intentar filtrar dentro del rango
  const filtered = results.filter(paper => {
    const year = paper.year;
    return year >= start && year <= end;
  });
  
  // Si no hay resultados en el rango, mostrar papers recientes (año actual o anterior)
  if (filtered.length === 0) {
    console.log('No results in range, showing recent papers');
    return results.filter(paper => paper.year >= start || paper.year === currentYear || paper.year === currentYear - 1);
  }
  
  return filtered;
};

/**
 * Formatea los resultados para mostrar
 * @param {Array} results - Array de resultados
 * @returns {Array} Resultados formateados
 */
export const formatResults = (results) => {
  return results.map(paper => ({
    ...paper,
    authors: paper.authors || 'Unknown',
    title: paper.title || 'Sin título',
    year: paper.year || new Date().getFullYear()
  }));
};

