import React, { useState, useMemo } from 'react'
import { jsPDF } from 'jspdf'

const Resultados = ({ searchData, results = [], onBackToSearch, onExportPDF, onSendWhatsApp }) => {
  const [sortBy, setSortBy] = useState('year') // year, title, author
  const [filterYear, setFilterYear] = useState('all')
  const [filterAuthor, setFilterAuthor] = useState('')
  const [sortOrder, setSortOrder] = useState('desc') // asc, desc
  const [showAbstract, setShowAbstract] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [showWhatsappInput, setShowWhatsappInput] = useState(false)
  
  // Usar los resultados pasados como prop, o un array vacío por defecto
  const allResults = useMemo(() => {
    return results && results.length > 0 ? results : [];
  }, [results]);

  // Filtrar y ordenar resultados
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...allResults];
    
    // Filtrar por año
    if (filterYear !== 'all') {
      filtered = filtered.filter(paper => paper.year.toString() === filterYear);
    }
    
    // Filtrar por autor
    if (filterAuthor) {
      filtered = filtered.filter(paper => 
        paper.authors.toLowerCase().includes(filterAuthor.toLowerCase())
      );
    }
    
    // Ordenar
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'year':
          comparison = a.year - b.year;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.authors.localeCompare(b.authors);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [allResults, filterYear, filterAuthor, sortBy, sortOrder]);

  // Obtener años únicos para el filtro
  const uniqueYears = useMemo(() => {
    const years = allResults.map(r => r.year);
    return [...new Set(years)].sort((a, b) => b - a);
  }, [allResults]);

  // Función para exportar a PDF
  const handleExportToPDF = () => {
    const doc = new jsPDF();
    
    // Configurar el PDF
    doc.setFontSize(16);
    doc.text('Resultados de Búsqueda Científica', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Tema: ${searchData?.searchTerm || 'N/A'}`, 20, 30);
    doc.text(`Rango: ${searchData?.startYear || 'N/A'} - ${searchData?.endYear || 'N/A'}`, 20, 36);
    doc.text(`Total de resultados: ${filteredAndSortedResults.length}`, 20, 42);
    doc.text(`Fuentes: ${searchData?.sources?.join(', ') || 'Múltiples'}`, 20, 48);
    
    let yPosition = 64;
    
    // Agregar cada paper al PDF
    filteredAndSortedResults.forEach((paper, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(`${index + 1}. ${paper.title}`, 170);
      doc.text(titleLines, 20, yPosition);
      yPosition += titleLines.length * 5;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`   Año: ${paper.year}`, 20, yPosition);
      yPosition += 5;
      
      const authorsLines = doc.splitTextToSize(`   Autores: ${paper.authors}`, 170);
      doc.text(authorsLines, 20, yPosition);
      yPosition += authorsLines.length * 5;
      
      doc.text(`   DOI: ${paper.doi}`, 20, yPosition);
      yPosition += 5;
      
      const urlLines = doc.splitTextToSize(`   URL: ${paper.url}`, 170);
      doc.text(urlLines, 20, yPosition);
      yPosition += urlLines.length * 5;
      
      if (paper.summary) {
        const summaryLines = doc.splitTextToSize(`   Resumen: ${paper.summary}`, 170);
        doc.text(summaryLines, 20, yPosition);
        yPosition += Math.min(summaryLines.length * 5, 20);
      }
      
      yPosition += 8;
    });
    
    // Footer con información adicional
    doc.setFontSize(8);
    doc.text('Generado por Sistema de Búsqueda Científica', 20, doc.internal.pageSize.height - 10);
    doc.text('https://tallerintegrador1-8e973.web.app', 20, doc.internal.pageSize.height - 5);
    
    // Guardar el PDF
    doc.save(`resultados_${searchData?.searchTerm?.replace(/\s+/g, '_') || 'busqueda'}.pdf`);
    
    if (onExportPDF) {
      onExportPDF();
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        color: '#333'
      }}
    >
      <div 
        style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {/* Header con información de búsqueda */}
        <div 
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '24px',
            borderRadius: '16px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <h1 
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#4f46e5',
              textAlign: 'center'
            }}
          >
            📚 Estado del Arte - {searchData?.searchTerm || 'Tema de Búsqueda'}
          </h1>
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px'
            }}
          >
            <div>
              <strong style={{ color: '#6b7280' }}>Área Temática:</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#1f2937', fontWeight: '500' }}>
                {searchData?.searchTerm || 'Tema de Investigación'}
              </p>
            </div>
            <div>
              <strong style={{ color: '#6b7280' }}>Período Analizado:</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#1f2937', fontWeight: '500' }}>
                {searchData?.startYear || '2024'} - {searchData?.endYear || '2025'}
              </p>
            </div>
            <div>
              <strong style={{ color: '#6b7280' }}>Artículos Relevantes:</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#4f46e5', fontWeight: '600' }}>
                {filteredAndSortedResults.length} papers seleccionados
                {filteredAndSortedResults.length !== allResults.length && (
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    {' '}(de {allResults.length} recolectados)
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {/* Sección de Metodología y Fuentes */}
          <div 
            style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}
          >
            <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#6b7280', lineHeight: '1.6' }}>
              <strong style={{ color: '#4f46e5' }}>Metodología aplicada:</strong> Definición del área temática → 
              Identificación de variables y keywords → Búsqueda en múltiples bases de datos → 
              Recolección de artículos → Filtrado por relevancia → Consolidación de resultados → Estado del Arte
            </p>
            {searchData?.sources && (
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#059669', lineHeight: '1.6' }}>
                <strong style={{ color: '#059669' }}>Fuentes consultadas:</strong> {searchData.sources.join(' • ')}
              </p>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div 
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={onBackToSearch}
            style={{
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4338ca'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#4f46e5'}
          >
            ← Nueva Búsqueda
          </button>
          
          <button
            onClick={handleExportToPDF}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
          >
            📄 Exportar PDF
          </button>
          
          <button
            onClick={() => setShowWhatsappInput(true)}
            style={{
              backgroundColor: '#25d366',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#128c7e'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#25d366'}
          >
            💬 Enviar a WhatsApp
          </button>
        </div>

        {/* Controles de filtro y ordenamiento */}
        <div 
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', color: '#4f46e5', fontSize: '1.25rem' }}>
            🔍 Refinar Estado del Arte
          </h3>
          <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '0.9rem' }}>
            Utiliza los siguientes criterios para filtrar y ordenar los artículos seleccionados:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {/* Filtro por año */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
                Filtrar por año:
              </label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <option value="all">Todos los años</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Filtro por autor */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
                Buscar por autor:
              </label>
              <input
                type="text"
                value={filterAuthor}
                onChange={(e) => setFilterAuthor(e.target.value)}
                placeholder="Nombre del autor..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            {/* Ordenar por */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
                Ordenar por:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <option value="year">Año</option>
                <option value="title">Título</option>
                <option value="author">Autor</option>
              </select>
            </div>

            {/* Orden */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
                Orden:
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de resultados */}
        <div 
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div 
            style={{
              overflowX: 'auto'
            }}
          >
            <table 
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '800px'
              }}
            >
              <thead>
                <tr 
                  style={{
                    backgroundColor: '#f8fafc',
                    borderBottom: '2px solid #4f46e5'
                  }}
                >
                  <th 
                    style={{
                      padding: '16px 12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#4f46e5',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Año
                  </th>
                  <th 
                    style={{
                      padding: '16px 12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#4f46e5',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Título
                  </th>
                  <th 
                    style={{
                      padding: '16px 12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#4f46e5',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Autores
                  </th>
                  <th 
                    style={{
                      padding: '16px 12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#4f46e5',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    DOI
                  </th>
                  <th 
                    style={{
                      padding: '16px 12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#4f46e5',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Fuente
                  </th>
                  <th 
                    style={{
                      padding: '16px 12px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#4f46e5',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedResults.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                      No se encontraron resultados con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedResults.map((paper, index) => (
                  <tr 
                    key={index}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <td 
                      style={{
                        padding: '16px 12px',
                        color: '#6b7280',
                        fontWeight: '500'
                      }}
                    >
                      {paper.year}
                    </td>
                    <td 
                      style={{
                        padding: '16px 12px',
                        color: '#1f2937',
                        maxWidth: '300px'
                      }}
                    >
                      <div 
                        style={{
                          fontWeight: '500',
                          marginBottom: '4px',
                          lineHeight: '1.4'
                        }}
                      >
                        {paper.title}
                      </div>
                    </td>
                    <td 
                      style={{
                        padding: '16px 12px',
                        color: '#6b7280',
                        maxWidth: '200px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <div
                        className="autores-columna"
                        style={{
                          maxHeight: '6em', // aprox. 4 líneas
                          overflowY: 'auto',
                          whiteSpace: 'normal',
                          color: '#6b7280',
                          fontSize: '0.9rem'
                        }}
                      >
                        {paper.authors}
                      </div>
                    </td>
                    <td 
                      style={{
                        padding: '16px 12px',
                        color: '#4f46e5',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace'
                      }}
                    >
                      <a 
                        href={paper.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#4f46e5',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        title={paper.url}
                      >
                        {paper.doi}
                      </a>
                    </td>
                    <td 
                      style={{
                        padding: '16px 12px',
                        color: '#6b7280',
                        fontSize: '0.9rem'
                      }}
                    >
                      {paper.source}
                    </td>
                    <td 
                      style={{
                        padding: '16px 12px',
                        textAlign: 'center'
                      }}
                    >
                      <div 
                        style={{
                          display: 'flex',
                          gap: '8px',
                          justifyContent: 'center'
                        }}
                      >
                        <a
                          href={paper.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: '#4f46e5',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            transition: 'background-color 0.2s',
                            display: 'inline-block'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#4338ca'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#4f46e5'}
                        >
                          Ver
                        </a>
                        <a
                          href={paper.pdf || paper.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            transition: 'background-color 0.2s',
                            display: 'inline-block'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                        >
                          PDF
                        </a>
                        {paper.summary && (
                          <button
                            onClick={() => {
                              setSelectedPaper(paper);
                              setShowAbstract(true);
                            }}
                            style={{
                              backgroundColor: '#10b981',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: '500',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                          >
                            Abstract
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal de WhatsApp */}
      {showWhatsappInput && (
        <div
          onClick={() => setShowWhatsappInput(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              maxWidth: '400px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', color: '#4f46e5', fontSize: '1.25rem', fontWeight: 'bold' }}>
              💬 Enviar a WhatsApp
            </h3>
            <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '0.875rem' }}>
              Ingresa el número de teléfono (Perú) para enviar los resultados.
            </p>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>
                Número (ej: 987654321)
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="987654321"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.75rem' }}>
                Formato: 987654321 (se agregará +51 automáticamente)
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowWhatsappInput(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (whatsappNumber) {
                    // Primero generar y descargar el PDF automáticamente
                    handleExportToPDF()
                    
                    // Luego enviar mensaje a WhatsApp
                    const message = `🔬 Resultados de búsqueda científica\n\n📚 Tema: ${searchData?.searchTerm}\n📅 Período: ${searchData?.startYear}-${searchData?.endYear}\n📊 Papers encontrados: ${filteredAndSortedResults.length}\n\n✅ PDF descargado con todos los detalles\n🔗 Ver aplicación: https://tallerintegrador1-8e973.web.app`
                    
                    // Formatear número para WhatsApp
                    let cleanNumber = whatsappNumber.replace(/\D/g, '') // Solo números
                    if (!cleanNumber.startsWith('51')) {
                      cleanNumber = '51' + cleanNumber
                    }
                    const formattedNumber = '+' + cleanNumber
                    
                    const url = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`
                    window.open(url, '_blank')
                    setShowWhatsappInput(false)
                  }
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#25d366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Enviar + PDF
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Abstract */}
      {showAbstract && selectedPaper && (
        <div
          onClick={() => setShowAbstract(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Header del Modal */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    margin: 0,
                    marginBottom: '8px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#1f2937'
                  }}
                >
                  {selectedPaper.title}
                </h2>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                  {selectedPaper.authors} • {selectedPaper.year}
                </p>
              </div>
              <button
                onClick={() => setShowAbstract(false)}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '16px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                ×
              </button>
            </div>
            
            {/* Abstract */}
            <div
              style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1
              }}
            >
              <h3
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '1.1rem',
                  color: '#4f46e5',
                  fontWeight: '600'
                }}
              >
                📄 Abstract
              </h3>
              <p
                style={{
                  margin: 0,
                  lineHeight: '1.7',
                  color: '#374151',
                  fontSize: '1rem',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {selectedPaper.summary || 'No abstract available.'}
              </p>
              
              {/* Información adicional */}
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.9rem' }}>
                  <strong>DOI:</strong> {selectedPaper.doi}
                </p>
                <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.9rem' }}>
                  <strong>Fuente:</strong> {selectedPaper.source}
                </p>
                {selectedPaper.url && (
                  <a
                    href={selectedPaper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#4f46e5',
                      textDecoration: 'none',
                      fontSize: '0.9rem'
                    }}
                  >
                    → Ver paper completo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Resultados
