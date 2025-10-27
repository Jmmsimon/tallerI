import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import Resultados from '../resultados/resultados.jsx'
import { unifiedSearch } from '../../services/unifiedSearchService'

const Topic = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [startYear, setStartYear] = useState('')
  const [endYear, setEndYear] = useState('')
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

  const handleSearch = async (e) => {
    e.preventDefault()
    console.log('Buscando:', { searchTerm, startYear, endYear })
    
    // Validar que se hayan llenado todos los campos
    if (!searchTerm.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor ingresa un tema de búsqueda',
        confirmButtonColor: '#4f46e5'
      })
      return
    }

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
    
    setIsSearching(true)
    setCurrentStep(0)

    try {
      // Calcular tiempo total para mostrar progreso (mínimo 30 segundos)
      const totalSteps = searchSteps.length;
      const minTotalTime = 30000; // 30 segundos en ms
      const timePerStep = Math.ceil(minTotalTime / totalSteps);
      
      let progressInterval;
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
        searchQuery: searchTerm,
        startYear,
        endYear,
        maxResults: 15 // 5 por fuente * 3 fuentes
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
      clearInterval(progressInterval);
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
        `}
      </style>
      <div 
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
        
        <form 
          style={{ marginTop: '32px' }}
          onSubmit={handleSearch}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Campo de búsqueda principal */}
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
