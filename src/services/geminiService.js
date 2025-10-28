

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
// Usar el modelo más reciente de Gemini
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * @param {Object} picoData - Datos del formulario PICO
 * @returns {Object} Keywords generados
 */
function generateKeywordsWithoutAI(picoData) {
  const { poblacion, intervencion, comparacion, outcome } = picoData;
  
  // Diccionario de términos relacionados con medicina
  const medicalTerms = ['clinical', 'patient', 'treatment', 'diagnosis', 'therapy', 'intervention', 'outcome', 'study'];
  
  // Extraer palabras clave importantes de cada campo
  const extractKeywords = (text) => {
    // Convertir a minúsculas y dividir por espacios
    const words = text.toLowerCase().split(/\s+/);
    
    // Filtrar palabras comunes (stop words)
    const stopWords = ['los', 'las', 'con', 'para', 'por', 'del', 'de', 'la', 'el', 'un', 'una', 'en', 'es', 'son', 'se', 'le', 'me', 'te', 'nos', 'les', 'como', 'cuando', 'donde', 'que', 'como', 'con', 'sin'];
    
    // Obtener palabras relevantes
    const keywords = words
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .map(word => word.replace(/[.,;:()]/g, ''))
      .filter(word => word.length > 0)
      .slice(0, 5); // Máximo 5 palabras por campo
    
    return keywords;
  };
  
  // Extraer keywords de cada campo
  const pKeywords = extractKeywords(poblacion || '');
  const iKeywords = extractKeywords(intervencion || '');
  const cKeywords = extractKeywords(comparacion || '');
  const oKeywords = extractKeywords(outcome || '');
  
  // Combinar todas las keywords
  const allKeywords = [
    ...pKeywords,
    ...iKeywords,
    ...cKeywords,
    ...oKeywords
  ];
  
  // Eliminar duplicados
  const uniqueKeywords = [...new Set(allKeywords)];
  
  // Traducir a inglés si es necesario (terminos médicos comunes)
  const translateMap = {
    'pacientes': 'patients',
    'cáncer': 'cancer',
    'pulmón': 'lung',
    'profundo': 'deep',
    'aprendizaje': 'learning',
    'redes': 'neural',
    'convolucionales': 'cnn',
    'neuronal': 'cnn',
    'radiólogos': 'radiologists',
    'expertos': 'experts',
    'diagnóstico': 'diagnosis',
    'precisión': 'accuracy',
    'detectar': 'detection',
    'nódulos': 'nodules',
    'pulmonares': 'pulmonary',
    'malignos': 'malignant',
    'benignos': 'benign',
    'intervención': 'intervention',
    'comparación': 'comparison',
    'resultado': 'outcome',
    'población': 'population'
  };
  
  const translatedKeywords = uniqueKeywords.map(k => {
    const lowerK = k.toLowerCase();
    return translateMap[lowerK] || k;
  }).filter(k => k && k.length > 2);
  
  // Si no hay suficientes keywords, agregar términos relacionados
  if (translatedKeywords.length < 5) {
    // Detectar tipo de investigación
    const hasDeepLearning = intervencion?.toLowerCase().includes('deep') || intervencion?.toLowerCase().includes('aprendizaje');
    const hasCNN = intervencion?.toLowerCase().includes('cnn') || intervencion?.toLowerCase().includes('redes');
    const hasRadiology = poblacion?.toLowerCase().includes('pulmón') || poblacion?.toLowerCase().includes('radiolog');
    
    if (hasDeepLearning || hasCNN) {
      translatedKeywords.push('machine learning', 'artificial intelligence', 'computer vision');
    }
    if (hasRadiology) {
      translatedKeywords.push('medical imaging', 'radiology');
    }
    
    translatedKeywords.push(...medicalTerms);
  }
  
  // Limitar a 8-10 keywords
  const finalKeywords = [...new Set(translatedKeywords)].slice(0, 10);
  
  return {
    keywords: finalKeywords,
    explanation: `Keywords generadas automáticamente desde: P(${poblacion}), I(${intervencion}), C(${comparacion}), O(${outcome})`
  };
}

/**
 * Genera keywords a partir de un formulario PICO
 * Intenta usar Gemini AI si está configurado, sino usa generación automática
 * @param {Object} picoData - Datos del formulario PICO
 * @param {string} picoData.poblacion - Población
 * @param {string} picoData.intervencion - Intervención
 * @param {string} picoData.comparacion - Comparación
 * @param {string} picoData.outcome - Outcome
 * @returns {Promise<Object>} Keywords generados
 */
export const generatePICOKeywords = async (picoData) => {
  try {
    // Si no hay API key configurada, usar generación automática
    if (!API_KEY || API_KEY === 'tu_api_key_aqui') {
      console.log('📝 Generando keywords sin IA externa (modo inteligente)...');
      const result = generateKeywordsWithoutAI(picoData);
      return {
        success: true,
        keywords: result.keywords,
        explanation: result.explanation,
        rawResponse: result.explanation,
        mode: 'automatic'
      };
    }

    const { poblacion, intervencion, comparacion, outcome } = picoData;

    // Construir el prompt para Gemini
    const prompt = `Como experto en búsqueda de literatura científica, genera keywords de búsqueda académicas para un estudio con PICO:

Población (P): ${poblacion || 'No especificado'}
Intervención (I): ${intervencion || 'No especificado'}
Comparación (C): ${comparacion || 'No especificado'}
Outcome (O): ${outcome || 'No especificado'}

Genera un conjunto de 5-10 keywords relevantes para buscar papers científicos sobre este tema.
Las keywords deben ser:
- Términos técnicos en inglés
- Palabras clave que investigadores usan en sus papers
- Específicas al área de investigación
- Apropiadas para búsquedas en bases de datos académicas

Responde SOLO con un JSON válido con este formato:
{
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "explanation": "Breve explicación de por qué estas keywords"
}`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Error en API de Gemini: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extraer el texto de la respuesta
    const text = data.candidates[0]?.content?.parts[0]?.text || '';
    
    if (!text) {
      throw new Error('No se pudo generar respuesta de Gemini');
    }

    // Intentar extraer JSON de la respuesta
    let keywordsData;
    try {
      // Buscar el JSON en el texto de respuesta
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        keywordsData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se encontró JSON válido en la respuesta');
      }
    } catch (parseError) {
      // Si no se puede parsear como JSON, crear una estructura manual
      console.warn('Respuesta no es JSON válido, intentando extraer keywords:', parseError);
      
      // Intentar extraer palabras clave del texto
      const lines = text.split('\n').filter(line => line.trim());
      const extractedKeywords = [];
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('*')) {
          // Extraer palabras que parezcan keywords
          const words = trimmed.split(/[,;]/).map(w => w.trim()).filter(w => w.length > 2);
          extractedKeywords.push(...words);
        }
      });
      
      keywordsData = {
        keywords: extractedKeywords.length > 0 ? extractedKeywords : ['pico', 'clinical research'],
        explanation: text
      };
    }

    console.log('✅ Keywords generadas por Gemini:', keywordsData);

    return {
      success: true,
      keywords: keywordsData.keywords || [],
      explanation: keywordsData.explanation || '',
      rawResponse: text
    };

  } catch (error) {
    console.error('❌ Error en Gemini AI, usando modo automático:', error);
    
    // Determinar el tipo de error
    const isAPIKeyError = error.message?.includes('API key') || error.message?.includes('not valid');
    const errorMessage = isAPIKeyError 
      ? 'La API key de Gemini no está habilitada o no tiene permisos. Usando modo automático inteligente.'
      : `Error de conexión con Gemini AI. Usando modo automático inteligente.`;
    
    console.warn('⚠️', errorMessage);
    
    // Si falla Gemini, usar generación automática como fallback
    try {
      console.log('📝 Generando keywords en modo inteligente (sin IA externa)...');
      const result = generateKeywordsWithoutAI(picoData);
      
      // Mostrar mensaje informativo si es error de API key
      if (isAPIKeyError && result.keywords.length > 0) {
        console.log('✅ Keywords generadas exitosamente sin API externa');
      }
      
      return {
        success: true,
        keywords: result.keywords,
        explanation: result.explanation,
        rawResponse: result.explanation,
        mode: 'automatic-fallback',
        warning: isAPIKeyError ? errorMessage : null
      };
    } catch (fallbackError) {
      console.error('❌ Error en generación automática:', fallbackError);
      throw new Error('No se pudieron generar keywords. Verifica los datos del formulario PICO.');
    }
  }
};

/**
 * Combina las keywords generadas en una query de búsqueda
 * @param {Array<string>} keywords - Array de keywords
 * @returns {string} Query combinada para búsqueda
 */
export const combineKeywordsToQuery = (keywords) => {
  if (!keywords || keywords.length === 0) {
    return '';
  }
  
  // Combinar keywords con operadores AND/OR según convenga
  // Usar OR para mayor amplitud de búsqueda
  return keywords.join(' OR ');
};

