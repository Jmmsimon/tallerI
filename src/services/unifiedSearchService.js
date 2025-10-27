import { searchArxiv } from './arxivService';
import { searchSemanticScholar } from './semanticScholarService';
import { searchOpenAlex } from './openAlexService';

/**
 * Busca papers en múltiples fuentes académicas
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Resultados consolidados
 */
/**
 * Detecta el dominio temático de la búsqueda
 */
function detectDomain(searchQuery) {
  const medicalKeywords = ['cancer', 'medical', 'medicine', 'health', 'disease', 'clinical', 
    'tumor', 'patient', 'diagnosis', 'treatment', 'therapy', 'biomedical', 'healthcare'];
  const lowerQuery = searchQuery.toLowerCase();
  
  const isMedical = medicalKeywords.some(keyword => lowerQuery.includes(keyword));
  
  return isMedical ? 'medical' : 'general';
}

export const unifiedSearch = async (params) => {
  const { searchQuery, startYear, endYear, maxResults = 50 } = params;
  
  console.log('🔍 Iniciando búsqueda unificada en múltiples fuentes...');
  
  // Detectar dominio de la búsqueda
  const domain = detectDomain(searchQuery);
  console.log(`📚 Dominio detectado: ${domain === 'medical' ? 'Medicina' : 'General'}`);
  
  // Limitar resultados por fuente para obtener los MEJORES (no todos)
  const resultsPerSource = 5; // Los 5 mejores de cada fuente
  
  // Para medicina, NO usar ArXiv (no es bueno para medicina)
  const sourcesToUse = domain === 'medical' ? 2 : 3;
  
  console.log(`🔍 Buscando en ${sourcesToUse} fuentes académicas (${resultsPerSource} papers por fuente)...`);
  
  // Realizar búsquedas en paralelo según dominio
  const searchPromises = [];
  
  // SIEMPRE buscar en Semantic Scholar y OpenAlex (buenas para todo)
  searchPromises.push(
    searchSemanticScholar({ 
      searchQuery, 
      limit: resultsPerSource 
    }).then(result => {
      console.log(`✅ Semantic Scholar: ${result.results.length} papers`);
      return { ...result, source: 'Semantic Scholar' };
    }).catch(err => {
      console.error('❌ Error en Semantic Scholar:', err.message);
      return { success: false, results: [], source: 'Semantic Scholar', totalResults: 0 };
    }),
    
    searchOpenAlex({ 
      searchQuery, 
      limit: resultsPerSource,
      startYear,
      endYear
    }).then(result => {
      console.log(`✅ OpenAlex: ${result.results.length} papers`);
      return { ...result, source: 'OpenAlex' };
    }).catch(err => {
      console.error('❌ Error en OpenAlex:', err.message);
      return { success: false, results: [], source: 'OpenAlex', totalResults: 0 };
    })
  );
  
  // Solo usar ArXiv si NO es medicina (ArXiv no es bueno para medicina)
  if (domain !== 'medical') {
    searchPromises.push(
      searchArxiv({ 
        searchQuery, 
        maxResults: resultsPerSource 
      }).then(result => {
        console.log(`✅ ArXiv: ${result.results.length} papers`);
        return { ...result, source: 'ArXiv' };
      }).catch(err => {
        console.error('❌ Error en ArXiv:', err.message);
        return { success: false, results: [], source: 'ArXiv', totalResults: 0 };
      })
    );
  }
  
  // Esperar a que todas las búsquedas terminen
  const results = await Promise.all(searchPromises);
  
  // Consolidar resultados
  const allPapers = [];
  const sources = [];
  let totalFound = 0;
  
  results.forEach((result, index) => {
    if (result.success && result.results) {
      sources.push(result.source || `Fuente ${index + 1}`);
      totalFound += result.totalResults || result.results.length;
      allPapers.push(...result.results);
    }
  });
  
  console.log(`📊 Total recolectado: ${allPapers.length} papers de ${sources.length} fuentes`);
  
  // Si no hay resultados de otras fuentes, usar ArXiv como respaldo (no tiene CORS)
  if (allPapers.length < 3) {
    console.log('⚠️ Pocos resultados, agregando ArXiv como respaldo...');
    try {
      const arxivResult = await searchArxiv({ 
        searchQuery, 
        maxResults: 20 
      });
      if (arxivResult.results && arxivResult.results.length > 0) {
        allPapers.push(...arxivResult.results);
        if (!sources.includes('ArXiv')) {
          sources.push('ArXiv');
        }
        console.log(`✅ ArXiv agregado: ${arxivResult.results.length} papers`);
      }
    } catch (err) {
      console.error('Error en ArXiv respaldo:', err);
    }
  }
  
  console.log(`📊 Total después de respaldo: ${allPapers.length} papers de ${sources.length} fuentes`);
  
  // Eliminar duplicados exactos por título
  const uniquePapers = removeDuplicates(allPapers);
  
  console.log(`✨ Después de eliminar duplicados: ${uniquePapers.length} papers únicos`);
  
  // CALCULAR RELEVANCIA - Filtrar solo papers relevantes al tema
  const papersWithRelevance = uniquePapers.map(paper => ({
    ...paper,
    relevanceScore: calculateRelevance(paper, searchQuery)
  }));
  
  // Filtrar por relevancia (solo los más relevantes)
  const RELEVANCE_THRESHOLD = 0.3; // 30% de relevancia mínima
  const relevantPapers = papersWithRelevance.filter(paper => paper.relevanceScore >= RELEVANCE_THRESHOLD);
  
  console.log(`🎯 Filtrado por relevancia: ${relevantPapers.length} papers relevantes de ${uniquePapers.length} totales`);
  
  // Si no hay papers relevantes, mostrar los mejores disponibles (más relajado)
  const papersToShow = relevantPapers.length > 0 ? relevantPapers : papersWithRelevance;
  
  // Ordenar por relevancia primero, luego por año
  papersToShow.sort((a, b) => {
    // Primero por relevancia (mayor es mejor)
    if (Math.abs(b.relevanceScore - a.relevanceScore) > 0.1) {
      return b.relevanceScore - a.relevanceScore;
    }
    // Luego por año (más recientes primero)
    return b.year - a.year;
  });
  
  // FILTRAR POR AÑO si se especificó el rango
  let filteredByYear = papersToShow;
  if (startYear && endYear) {
    const start = parseInt(startYear);
    const end = parseInt(endYear);
    filteredByYear = papersToShow.filter(paper => paper.year >= start && paper.year <= end);
    console.log(`📅 Filtrado por año (${start}-${end}): ${filteredByYear.length} papers`);
  }
  
  console.log(`✅ Búsqueda completa: ${filteredByYear.length} papers únicos filtrados de ${sources.join(', ')}`);
  
  return {
    success: true,
    totalResults: filteredByYear.length,
    results: filteredByYear,
    sources: sources,
    query: searchQuery
  };
};

/**
 * Calcula la relevancia de un paper respecto a la búsqueda
 */
function calculateRelevance(paper, searchQuery) {
  const queryWords = searchQuery.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const title = paper.title.toLowerCase();
  const summary = paper.summary ? paper.summary.toLowerCase() : '';
  const authors = paper.authors ? paper.authors.toLowerCase() : '';
  
  let score = 0;
  let matches = 0;
  
  // Buscar coincidencias en el título (más peso)
  queryWords.forEach(word => {
    const titleMatches = (title.match(new RegExp(word, 'g')) || []).length;
    score += titleMatches * 3; // Título tiene más peso
    if (titleMatches > 0) matches++;
  });
  
  // Buscar coincidencias en el resumen
  queryWords.forEach(word => {
    const summaryMatches = (summary.match(new RegExp(word, 'g')) || []).length;
    score += summaryMatches * 1;
    if (summaryMatches > 0) matches++;
  });
  
  // Buscar coincidencias en autores (menos peso)
  queryWords.forEach(word => {
    const authorMatches = (authors.match(new RegExp(word, 'g')) || []).length;
    score += authorMatches * 0.5;
  });
  
  // Normalizar el score (entre 0 y 1)
  // Máximo score posible: todas las palabras del query aparecen múltiples veces
  const maxPossibleScore = queryWords.length * 5; // aprox
  const normalizedScore = Math.min(1, score / maxPossibleScore);
  
  // Bonificación si coinciden TODAS las palabras importantes
  const allWordsMatch = matches === queryWords.length;
  if (allWordsMatch) {
    return Math.min(1, normalizedScore + 0.2);
  }
  
  return normalizedScore;
}

/**
 * Elimina duplicados por título similar
 */
function removeDuplicates(papers) {
  const seen = new Set();
  const unique = [];
  
  papers.forEach(paper => {
    // Normalizar título para comparación
    const normalizedTitle = paper.title.toLowerCase().trim();
    
    // Verificar si ya existe un título similar
    let isDuplicate = false;
    for (const seenTitle of seen) {
      if (areSimilar(normalizedTitle, seenTitle)) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      seen.add(normalizedTitle);
      unique.push(paper);
    }
  });
  
  return unique;
}

/**
 * Compara dos títulos para ver si son similares
 */
function areSimilar(title1, title2) {
  // Si son idénticos
  if (title1 === title2) return true;
  
  // Calcular similitud básica (podría mejorarse con Levenshtein)
  const words1 = title1.split(/\s+/);
  const words2 = title2.split(/\s+/);
  
  // Si tienen más del 80% de palabras en común, son similares
  const commonWords = words1.filter(w => words2.includes(w));
  const similarity = commonWords.length / Math.max(words1.length, words2.length);
  
  return similarity > 0.8;
}

