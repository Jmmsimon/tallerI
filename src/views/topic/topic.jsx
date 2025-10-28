import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import Resultados from '../resultados/resultados.jsx'
import { unifiedSearch } from '../../services/unifiedSearchService'
import { generatePICOKeywords, combineKeywordsToQuery } from '../../services/geminiService'

const Topic = () => {
  // Estado para modo de búsqueda
  const [searchMode, setSearchMode] = useState('normal') // 'normal' o 'pico'
  
  // Búsqueda normal
  const [searchTerm, setSearchTerm] = useState('')
  const [startYear, setStartYear] = useState('')
  const [endYear, setEndYear] = useState('')
  const [maxResults, setMaxResults] = useState(20)
  
  // Búsqueda PICO
  const [poblacion, setPoblacion] = useState('')
  const [intervencion, setIntervencion] = useState('')
  const [comparacion, setComparacion] = useState('')
  const [outcome, setOutcome] = useState('')
  const [generatedKeywords, setGeneratedKeywords] = useState([])
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false)
  
  // Estado común
  const [isSearching, setIsSearching] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [searchData, setSearchData] = useState(null)
  const [searchResults, setSearchResults] = useState([])

  const searchSteps = [
    '📚 Definiendo el área temática...',
    '🔍 Identificando variables y keywords...',
    '🌐 Buscando en bases de datos académicas (ArXiv)...',
    '📊 Recolectando artículos científicos...',
    '✔️ Filtrando artículos relevantes...',
    '📑 Consolidando resultados seleccionados...',
    '✅ Construyendo el Estado del Arte...'
  ]

  useEffect(() => {
    // Verificar si la imagen se puede cargar
    const img = new Image()
    img.onload = () => console.log('Imagen cargada correctamente')
    img.onerror = () => console.log('Error al cargar la imagen')
    img.src = '/images/image fondo.png'
  }, [])

  // Función para generar keywords con PICO
  const handleGenerateKeywords = async () => {
    // Validar que todos los campos PICO estén llenos
    if (!poblacion.trim() || !intervencion.trim() || !comparacion.trim() || !outcome.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos del formulario PICO',
        confirmButtonColor: '#4f46e5'
      })
      return
    }

    setIsGeneratingKeywords(true)

    try {
      const result = await generatePICOKeywords({
        poblacion,
        intervencion,
        comparacion,
        outcome
      })

      if (result.success && result.keywords.length > 0) {
        setGeneratedKeywords(result.keywords)
        
        // Determinar el modo usado
        const mode = result.mode === 'automatic' || result.mode === 'automatic-fallback' 
          ? ' (Modo Inteligente)' 
          : ' (IA Gemini)';
        
        await Swal.fire({
          icon: 'success',
          title: `Keywords generadas${mode}`,
          html: `<div style="text-align: left;">
            <p><strong>Keywords generadas:</strong></p>
            <ul style="padding-left: 20px;">
              ${result.keywords.map(k => `<li>${k}</li>`).join('')}
            </ul>
            ${result.mode === 'automatic' || result.mode === 'automatic-fallback' ? 
              '<p style="margin-top: 10px; font-size: 0.8rem; color: #666;"><em>💡 Tip: Configura Gemini AI para keywords más precisas</em></p>' : ''}
          </div>`,
          confirmButtonColor: '#4f46e5'
        })
      } else {
        throw new Error('No se pudieron generar keywords')
      }
    } catch (error) {
      console.error('Error generando keywords:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error generando keywords',
        text: error.message || 'No se pudieron generar keywords. Verifica tu configuración de Gemini AI.',
        confirmButtonColor: '#dc2626'
      })
    } finally {
      setIsGeneratingKeywords(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    
    // Determinar el término de búsqueda según el modo
    let finalSearchTerm = '';
    
    if (searchMode === 'pico') {
      // Validar PICO
      if (!poblacion.trim() || !intervencion.trim() || !comparacion.trim() || !outcome.trim()) {
        await Swal.fire({
          icon: 'warning',
          title: 'Campos requeridos',
          text: 'Por favor completa todos los campos del formulario PICO',
          confirmButtonColor: '#4f46e5'
        })
        return
      }
      
      // Si hay keywords generadas, usarlas
      if (generatedKeywords.length > 0) {
        finalSearchTerm = combineKeywordsToQuery(generatedKeywords)
      } else {
        await Swal.fire({
          icon: 'warning',
          title: 'Keywords requeridas',
          text: 'Primero debes generar keywords con IA usando el botón azul',
          confirmButtonColor: '#4f46e5'
        })
        return
      }
    } else {
      // Búsqueda normal
      if (!searchTerm.trim()) {
        await Swal.fire({
          icon: 'warning',
          title: 'Campo requerido',
          text: 'Por favor ingresa un tema de búsqueda',
          confirmButtonColor: '#4f46e5'
        })
        return
      }
      finalSearchTerm = searchTerm
    }
    
    console.log('Buscando:', { searchTerm: finalSearchTerm, startYear, endYear, mode: searchMode })

    if (!startYear || !endYear) {
      await Swal.fire({
        icon: 'warning',
        title: 'Años requeridos',
        text: 'Por favor ingresa tanto el año de inicio como el año final',
        confirmButtonColor: '#4f46e5'
      })
      return
    }

    // Validar que el año de inicio sea menor o igual al año final
    if (parseInt(startYear) > parseInt(endYear)) {
      await Swal.fire({
        icon: 'error',
        title: 'Rango inválido',
        text: 'El año de inicio debe ser menor o igual al año final',
        confirmButtonColor: '#dc2626'
      })
      return
    }

    // Validar que el rango no exceda 10 años
    const yearDifference = parseInt(endYear) - parseInt(startYear)
    if (yearDifference > 10) {
      await Swal.fire({
        icon: 'error',
        title: 'Rango demasiado amplio',
        text: `El rango de búsqueda no puede exceder 10 años. Tu rango actual es de ${yearDifference + 1} años (${startYear}-${endYear}). Por favor, reduce el rango de búsqueda.`,
        confirmButtonColor: '#dc2626'
      })
      return
    }

    // Validar límite de resultados
    const resultsLimit = parseInt(maxResults)
    if (resultsLimit < 1 || resultsLimit > 20) {
      await Swal.fire({
        icon: 'error',
        title: 'Cantidad inválida',
        text: 'La cantidad de resultados debe estar entre 1 y 20.',
        confirmButtonColor: '#dc2626'
      })
      return
    }
    
    setIsSearching(true)
    setCurrentStep(0)

    let progressInterval;
    
    try {
      // Calcular tiempo total para mostrar progreso (mínimo 30 segundos)
      const totalSteps = searchSteps.length;
      const minTotalTime = 30000; // 30 segundos en ms
      const timePerStep = Math.ceil(minTotalTime / totalSteps);
      
      let currentStepIndex = 0;
      
      progressInterval = setInterval(() => {
        if (currentStepIndex < totalSteps - 1) {
          currentStepIndex++;
          setCurrentStep(currentStepIndex);
        } else {
          clearInterval(progressInterval);
        }
      }, timePerStep);

      // Búsqueda real en múltiples fuentes académicas
      console.log('🔍 Buscando en múltiples fuentes académicas...');
      
      // Hacer la búsqueda
      const searchResponse = await unifiedSearch({
        searchQuery: finalSearchTerm,
        startYear,
        endYear,
        maxResults: resultsLimit
      });
      
      // Si la búsqueda terminó muy rápido, esperar hasta completar el mínimo de tiempo
      // para que el usuario vea el progreso completo
      await new Promise(resolve => setTimeout(resolve, 10000));

      // Los resultados ya vienen filtrados de unifiedSearch
      const filteredResults = searchResponse.results;

      clearInterval(progressInterval);
      setIsSearching(false);
      setCurrentStep(searchSteps.length - 1);

      if (filteredResults.length === 0) {
        await Swal.fire({
          icon: 'info',
          title: 'Sin resultados',
          text: `No se encontraron papers para "${searchTerm}" en el rango ${startYear}-${endYear}. Intenta ampliar el rango de búsqueda.`,
          confirmButtonColor: '#4f46e5'
        });
        return;
      }

      // Guardar datos de búsqueda y resultados
      setSearchData({
        searchTerm,
        startYear,
        endYear,
        totalFound: searchResponse.totalResults,
        filteredCount: filteredResults.length,
        sources: searchResponse.sources || ['Múltiples fuentes']
      });
      setSearchResults(filteredResults);
      setShowResults(true);

      console.log(`✅ Encontrados ${filteredResults.length} papers únicos de ${searchResponse.sources?.join(', ') || 'múltiples fuentes'}`);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setIsSearching(false);
      setCurrentStep(0);
      
      await Swal.fire({
        icon: 'error',
        title: 'Error en la búsqueda',
        text: error.message || 'Ocurrió un error al buscar en ArXiv. Intenta nuevamente.',
        confirmButtonColor: '#dc2626'
      });
    }
  }

  const handleBackToSearch = () => {
    setShowResults(false)
    setSearchData(null)
    setSearchResults([])
    setSearchTerm('')
    setStartYear('')
    setEndYear('')
    setMaxResults(20)
    setPoblacion('')
    setIntervencion('')
    setComparacion('')
    setOutcome('')
    setGeneratedKeywords([])
    setSearchMode('normal')
  }

  const handleExportPDF = () => {
    Swal.fire({
      icon: 'info',
      title: 'Función en desarrollo',
      text: 'La función de exportar PDF estará disponible próximamente',
      confirmButtonColor: '#4f46e5'
    })
  }

  const handleSendWhatsApp = () => {
    const message = `🔬 Resultados de búsqueda científica:\n\nTema: ${searchData?.searchTerm}\nPeríodo: ${searchData?.startYear}-${searchData?.endYear}\n\nVer resultados completos en la aplicación.`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // Si se muestran los resultados, renderizar la vista de resultados
  if (showResults) {
    return (
      <Resultados 
        searchData={searchData}
        results={searchResults}
        onBackToSearch={handleBackToSearch}
        onExportPDF={handleExportPDF}
        onSendWhatsApp={handleSendWhatsApp}
      />
    )
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .main-container {
              flex-direction: column;
            }
            
            .form-section {
              width: 100% !important;
              min-height: 60vh;
              padding: 32px 20px !important;
            }
            
            .image-section {
              width: 100% !important;
              min-height: 40vh;
            }
          }
        `}
      </style>
      <div 
        className="main-container"
        style={{
          minHeight: '100vh',
          display: 'flex',
          position: 'relative'
        }}
      >
      {/* Overlay de carga */}
      {isSearching && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div 
            style={{
              backgroundColor: '#1a1a1a',
              padding: '40px',
              borderRadius: '16px',
              textAlign: 'center',
              maxWidth: '400px',
              width: '90%'
            }}
          >
            {/* Spinner animado */}
            <div 
              style={{
                width: '60px',
                height: '60px',
                border: '4px solid #333',
                borderTop: '4px solid #4f46e5',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 24px'
              }}
            ></div>
            
            {/* Texto de progreso */}
            <h3 
              style={{
                color: 'white',
                fontSize: '1.5rem',
                marginBottom: '16px',
                fontWeight: '600',
                minHeight: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              {searchSteps[currentStep]}
            </h3>
            
            {/* Barra de progreso */}
            <div 
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#333',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '16px'
              }}
            >
              <div 
                style={{
                  width: `${((currentStep + 1) / searchSteps.length) * 100}%`,
                  height: '100%',
                  backgroundColor: '#4f46e5',
                  transition: 'width 0.3s ease'
                }}
              ></div>
            </div>
            
            {/* Porcentaje */}
            <p 
              style={{
                color: '#a1a1aa',
                fontSize: '0.875rem',
                margin: 0
              }}
            >
              {Math.round(((currentStep + 1) / searchSteps.length) * 100)}%
            </p>
          </div>
        </div>
      )}
      {/* Columna izquierda - Formulario */}
      <div 
        className="form-section"
        style={{
          width: '50%',
          backgroundColor: '#0f0f0f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 32px'
        }}
      >
        <div 
          style={{
            maxWidth: '28rem',
            width: '100%'
          }}
        >
        <div style={{ marginBottom: '32px' }}>
          <h2 
            style={{
              textAlign: 'center',
              fontSize: '2.5rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '16px'
            }}
          >
            Busca tu tema de interés
          </h2>
          <p 
            style={{
              textAlign: 'center',
              fontSize: '1.125rem',
              color: '#a1a1aa',
              margin: 0
            }}
          >
            Encuentra los papers que necesitas
          </p>
        </div>

        {/* Tabs para cambiar entre búsqueda normal y PICO */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '4px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => setSearchMode('normal')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: searchMode === 'normal' ? '#4f46e5' : 'transparent',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            🔍 Búsqueda Normal
          </button>
          <button
            type="button"
            onClick={() => setSearchMode('pico')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: searchMode === 'pico' ? '#4f46e5' : 'transparent',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            🧬 Búsqueda PICO
          </button>
        </div>
        
        <form 
          style={{ marginTop: '32px' }}
          onSubmit={handleSearch}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Formulario PICO */}
            {searchMode === 'pico' ? (
              <>
                <div>
                  <label htmlFor="poblacion" style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
                    P (Población):
                  </label>
                  <input
                    id="poblacion"
                    name="poblacion"
                    type="text"
                    style={{
                      appearance: 'none',
                      borderRadius: '8px',
                      position: 'relative',
                      display: 'block',
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#111827',
                      fontSize: '14px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      outline: 'none'
                    }}
                    placeholder="Ej: Pacientes con cáncer de pulmón"
                    value={poblacion}
                    onChange={(e) => setPoblacion(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="intervencion" style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
                    I (Intervención):
                  </label>
                  <input
                    id="intervencion"
                    name="intervencion"
                    type="text"
                    style={{
                      appearance: 'none',
                      borderRadius: '8px',
                      position: 'relative',
                      display: 'block',
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#111827',
                      fontSize: '14px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      outline: 'none'
                    }}
                    placeholder="Ej: Uso de Deep Learning para detectar nódulos"
                    value={intervencion}
                    onChange={(e) => setIntervencion(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="comparacion" style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
                    C (Comparación):
                  </label>
                  <input
                    id="comparacion"
                    name="comparacion"
                    type="text"
                    style={{
                      appearance: 'none',
                      borderRadius: '8px',
                      position: 'relative',
                      display: 'block',
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#111827',
                      fontSize: '14px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      outline: 'none'
                    }}
                    placeholder="Ej: Radiólogos expertos"
                    value={comparacion}
                    onChange={(e) => setComparacion(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="outcome" style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
                    O (Outcome):
                  </label>
                  <input
                    id="outcome"
                    name="outcome"
                    type="text"
                    style={{
                      appearance: 'none',
                      borderRadius: '8px',
                      position: 'relative',
                      display: 'block',
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#111827',
                      fontSize: '14px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      outline: 'none'
                    }}
                    placeholder="Ej: Precisión del diagnóstico"
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                  />
                </div>

                {/* Botón para generar keywords */}
                <button
                  type="button"
                  onClick={handleGenerateKeywords}
                  disabled={isGeneratingKeywords}
                  style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 16px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '8px',
                    color: 'white',
                    backgroundColor: isGeneratingKeywords ? '#6b7280' : '#8b5cf6',
                    cursor: isGeneratingKeywords ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    transition: 'background-color 0.15s ease-in-out'
                  }}
                >
                  {isGeneratingKeywords ? '⏳ Generando keywords...' : '✨ Generar Keywords con IA'}
                </button>

                {/* Mostrar keywords generadas */}
                {generatedKeywords.length > 0 && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}>
                    <p style={{ color: 'white', fontSize: '0.875rem', margin: '0 0 8px 0' }}>
                      <strong>Keywords generadas:</strong>
                    </p>
                    <p style={{ color: '#d1d5db', fontSize: '0.8rem', margin: 0 }}>
                      {generatedKeywords.join(', ')}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Campo de búsqueda normal */}
                <div>
                  <label htmlFor="searchTerm" className="sr-only">
                    Buscar papers sobre:
                  </label>
                  <input
                    id="searchTerm"
                    name="searchTerm"
                    type="text"
                    required
                    style={{
                      appearance: 'none',
                      borderRadius: '8px',
                      position: 'relative',
                      display: 'block',
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#111827',
                      fontSize: '14px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      outline: 'none'
                    }}
                    placeholder="Buscar papers sobre:"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Filtro por fecha - Años */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label htmlFor="startYear" className="sr-only">
                  Año inicio
                </label>
                <input
                  id="startYear"
                  name="startYear"
                  type="number"
                  min="1900"
                  max="2030"
                  style={{
                    appearance: 'none',
                    borderRadius: '8px',
                    position: 'relative',
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#111827',
                    fontSize: '14px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    outline: 'none'
                  }}
                  placeholder="Año inicio"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="endYear" className="sr-only">
                  Año fin
                </label>
                <input
                  id="endYear"
                  name="endYear"
                  type="number"
                  min="1900"
                  max="2030"
                  style={{
                    appearance: 'none',
                    borderRadius: '8px',
                    position: 'relative',
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#111827',
                    fontSize: '14px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    outline: 'none'
                  }}
                  placeholder="Año fin"
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                />
              </div>
            </div>
            
            {/* Campo de cantidad de resultados */}
            <div>
              <label htmlFor="maxResults" style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
                Cantidad máxima de resultados:
              </label>
              <input
                id="maxResults"
                name="maxResults"
                type="number"
                min="1"
                max="20"
                style={{
                  appearance: 'none',
                  borderRadius: '8px',
                  position: 'relative',
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#111827',
                  fontSize: '14px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  outline: 'none'
                }}
                placeholder="Ej: 10 (1-20)"
                value={maxResults}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 20)) {
                    setMaxResults(value);
                  }
                }}
              />
            </div>
          </div>

          {/* Botón de búsqueda */}
          <div style={{ marginTop: '24px' }}>
            <button
              type="submit"
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '12px 16px',
                border: '1px solid transparent',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '8px',
                color: 'white',
                backgroundColor: '#4f46e5',
                cursor: 'pointer',
                outline: 'none',
                transition: 'background-color 0.15s ease-in-out'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#4338ca'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#4f46e5'}
            >
              Buscar
            </button>
          </div>
        </form>
        </div>
      </div>

      {/* Columna derecha - Imagen */}
      <div 
        className="image-section"
        style={{
          width: '50%',
          backgroundImage: `url('/images/banner.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      </div>
    </>
  )
}

export default Topic
