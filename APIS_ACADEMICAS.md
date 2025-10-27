# 📚 APIs Académicas Integradas

## ✅ Fuentes Implementadas

Tu buscador ahora consulta **3 fuentes académicas** en paralelo:

### 1. ArXiv 📄
- **URL**: https://arxiv.org/api
- **Tipo**: Preprints de ciencia
- **Gratis**: ✅ Totalmente gratis
- **Características**:
  - Papers científicos antes de publicación
  - Matemáticas, física, ciencias de la computación
  - ~2 millones de papers

### 2. Semantic Scholar 🔬
- **URL**: https://api.semanticscholar.org
- **Tipo**: Metadatos académicos
- **Gratis**: ✅ Totalmente gratis (open data)
- **Características**:
  - Metadatos de artículos científicos
  - Información de citas
  - PDFs de acceso abierto
  - Datos de autores y venues

### 3. OpenAlex 📊
- **URL**: https://api.openalex.org
- **Tipo**: Índice académico abierto
- **Gratis**: ✅ Totalmente gratis (open data)
- **Características**:
  - Índice de 300+ millones de trabajos
  - Datos de autores, instituciones, conceptos
  - Estadísticas, keywords, mapas temáticos
  - Ideal para análisis bibliométrico

---

## 🚀 Cómo Funciona

### Flujo de Búsqueda

1. **Usuario ingresa tema** → Ejemplo: "deep learning"

2. **Sistema busca en paralelo**:
   ```
   ArXiv          → Papers recientes
   Semantic Scholar → Metadatos académicos
   OpenAlex        → Índice general
   ```

3. **Consolidación automática**:
   - Elimina duplicados por título
   - Combina resultados de todas las fuentes
   - Ordena por año (más recientes primero)

4. **Resultados unificados**:
   - Papers únicos
   - Filtrados por rango de años
   - Listos para análisis

---

## 📊 Ventajas del Sistema Multi-Fuente

### ✅ Cobertura Amplia
- Papers de múltiples áreas (no solo ArXiv)
- Metadatos enriquecidos
- Más probabilidad de encontrar papers relevantes

### ✅ Datos de Calidad
- Semantic Scholar: información de citas y venues
- OpenAlex: datos normalizados y enriquecidos
- ArXiv: papers recientes antes de publicación

### ✅ Eliminación de Duplicados
- El sistema identifica papers similares automáticamente
- Evita mostrar el mismo paper múltiples veces
- Mantiene coherencia en los resultados

### ✅ Búsqueda Paralela
- Más rápido que buscar secuencialmente
- Si una API falla, las otras siguen funcionando
- Resultados más completos

---

## 🎯 Casos de Uso

### Búsqueda Básica
```javascript
// Ejemplo: buscar papers sobre "machine learning"
unifiedSearch({
  searchQuery: "machine learning",
  startYear: 2023,
  endYear: 2024,
  maxResults: 50
})
```

### Resultado Esperado
```javascript
{
  success: true,
  totalResults: 45,
  sources: ["ArXiv", "Semantic Scholar", "OpenAlex"],
  results: [
    {
      title: "Deep Learning for Computer Vision",
      authors: "John Doe, Jane Smith",
      year: 2024,
      source: "Semantic Scholar",
      pdf: "https://...",
      url: "https://...",
      ...
    },
    // ... más papers
  ]
}
```

---

## 🔧 Fuentes Adicionales Disponibles (No Implementadas Aún)

### Web of Science
- **URL**: https://developer.clarivate.com
- **Plan Gratuito**: 50 requests/día
- **Requisitos**: Registro + API Key
- **Ventaja**: Metadatos de alta calidad

### IEEE Xplore
- **URL**: https://developer.ieee.org
- **Requisitos**: Registro + API Key, posible suscripción
- **Ventaja**: Ingeniería y tecnología

### Google Scholar
- ⚠️ **No existe API oficial**
- Alternativas: ScraperAPI, SerpAPI (planes de pago)
- Consideraciones éticas de scraping

---

## 📝 Metodología Implementada

Tu aplicación ahora sigue el proceso completo de **Estado del Arte**:

1. ✅ **Definir área temática** - Campo de búsqueda
2. ✅ **Identificar variables y keywords** - Término + años
3. ✅ **Buscar en bases de datos** - ArXiv + Semantic Scholar + OpenAlex
4. ✅ **Recolectar artículos** - Hasta 50 por fuente (150 total)
5. ✅ **Filtrar por relevancia** - Por año y similitud
6. ✅ **Consolidar resultados** - Eliminar duplicados
7. ✅ **Construir Estado del Arte** - Lista final de papers

---

## 🌐 Uso en Producción

**URL**: https://tallerintegrador1-8e973.web.app

### Ejemplo de Búsqueda
```
Tema: "reinforcement learning"
Año inicio: 2023
Año fin: 2024
```

### Resultado
- ~150 papers de 3 fuentes diferentes
- Consolidados a ~50 papers únicos
- Filtrados por año
- Listos para análisis académico

---

## 🎓 Ventajas Académicas

1. **Cobertura completa**: No te pierdes papers importantes
2. **Fuentes verificadas**: APIs oficiales y gratuitas
3. **Metadatos enriquecidos**: Autores, citas, venues
4. **Eficiencia**: Búsqueda paralela y rápida
5. **Profesional**: Resultados listos para investigación

---

**¿Listo para probarlo?** Ve a https://tallerintegrador1-8e973.web.app y realiza una búsqueda. 🚀

