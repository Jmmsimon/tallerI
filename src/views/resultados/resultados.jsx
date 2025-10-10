import React from 'react'

const Resultados = ({ searchData, onBackToSearch, onExportPDF, onSendWhatsApp }) => {
  // Datos de ejemplo para la tabla
  const sampleResults = [
    {
      year: 2024,
      title: "Advances in Breast Cancer Treatment: A Comprehensive Review",
      authors: "Dr. María García, Dr. Juan Pérez, Dr. Ana López",
      doi: "10.1000/182",
      url: "https://example.com/paper1",
      source: "Nature Medicine",
      pdf: "https://example.com/paper1.pdf"
    },
    {
      year: 2024,
      title: "Machine Learning Applications in Breast Cancer Detection",
      authors: "Dr. Carlos Rodríguez, Dr. Laura Martínez",
      doi: "10.1000/183",
      url: "https://example.com/paper2",
      source: "Journal of Medical AI",
      pdf: "https://example.com/paper2.pdf"
    },
    {
      year: 2023,
      title: "Immunotherapy Strategies for Triple-Negative Breast Cancer",
      authors: "Dr. Elena Fernández, Dr. Miguel Torres",
      doi: "10.1000/184",
      url: "https://example.com/paper3",
      source: "Cancer Research",
      pdf: "https://example.com/paper3.pdf"
    },
    {
      year: 2024,
      title: "Genomic Profiling in Early-Stage Breast Cancer",
      authors: "Dr. Sofia Herrera, Dr. David Ruiz",
      doi: "10.1000/185",
      url: "https://example.com/paper4",
      source: "The Lancet Oncology",
      pdf: "https://example.com/paper4.pdf"
    },
    {
      year: 2023,
      title: "Patient-Reported Outcomes in Breast Cancer Survivorship",
      authors: "Dr. Carmen Vega, Dr. Roberto Silva",
      doi: "10.1000/186",
      url: "https://example.com/paper5",
      source: "Journal of Clinical Oncology",
      pdf: "https://example.com/paper5.pdf"
    }
  ]

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
            🔬 Resultados de Búsqueda
          </h1>
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px'
            }}
          >
            <div>
              <strong style={{ color: '#6b7280' }}>Tema de búsqueda:</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#1f2937', fontWeight: '500' }}>
                {searchData?.searchTerm || 'Cancer de Mama'}
              </p>
            </div>
            <div>
              <strong style={{ color: '#6b7280' }}>Rango de fechas:</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#1f2937', fontWeight: '500' }}>
                {searchData?.startYear || '2024'} - {searchData?.endYear || '2025'}
              </p>
            </div>
            <div>
              <strong style={{ color: '#6b7280' }}>Total de resultados:</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#4f46e5', fontWeight: '600' }}>
                {sampleResults.length} papers encontrados
              </p>
            </div>
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
            onClick={onExportPDF}
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
            onClick={onSendWhatsApp}
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
                {sampleResults.map((paper, index) => (
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
                      {paper.authors}
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
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#4f46e5',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
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
                          href={paper.url}
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
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#4338ca'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#4f46e5'}
                        >
                          Ver
                        </a>
                        <a
                          href={paper.pdf}
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
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                        >
                          PDF
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resultados
