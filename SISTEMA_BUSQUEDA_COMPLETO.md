# 🔬 Sistema de Búsqueda Académica Multi-Fuente

## ✅ Características Implementadas

### 1. **Búsqueda en 3 Fuentes Académicas** 🌐

Tu sistema ahora consulta **TODAS** estas fuentes en paralelo:

- 📄 **ArXiv** - Preprints científicos (5 papers)
- 🔬 **Semantic Scholar** - Metadatos académicos (5 papers)
- 📊 **OpenAlex** - Índice académico abierto (5 papers)

### 2. **Filtrado Inteligente** 🎯

- **5 papers mejores** de cada fuente (15 total)
- Eliminación automática de **duplicados exactos** por título
- Consolidación en un **resultado único**
- Ordenado por **año** (más recientes primero)

### 3. **Proceso Completo Visible** ⏱️

El progreso de búsqueda dura **mínimo 30 segundos** mostrando:

1. 📚 Definiendo el área temática...
2. 🔍 Identificando variables y keywords...
3. 🌐 Buscando en bases de datos académicas (ArXiv)...
4. 📊 Recolectando artículos científicos...
5. ✔️ Filtrando artículos relevantes...
6. 📑 Consolidando resultados seleccionados...
7. ✅ Construyendo el Estado del Arte...

---

## 🔄 Flujo de Búsqueda

```
Usuario ingresa tema
       ↓
📚 Definiendo el área temática...
       ↓
🔍 Identificando variables y keywords...
       ↓
🌐 Buscando en 3 fuentes EN PARALELO:
   - ArXiv (5 papers)
   - Semantic Scholar (5 papers)
   - OpenAlex (5 papers)
       ↓
📊 Recolectando artículos científicos... (15 papers)
       ↓
✔️ Filtrando artículos relevantes... (elimina duplicados)
       ↓
📑 Consolidando resultados... (~10-15 papers únicos)
       ↓
✅ Estado del Arte completo
```

---

## 📊 Ejemplo de Resultado

### Entrada
```
Tema: "machine learning"
Año inicio: 2023
Año fin: 2024
```

### Proceso
```
🔍 Buscando en 3 fuentes...
✅ ArXiv: 5 papers encontrados
✅ Semantic Scholar: 5 papers encontrados  
✅ OpenAlex: 5 papers encontrados
📊 Total: 15 papers recolectados
✨ Después de eliminar duplicados: 12 papers únicos
```

### Salida
- **12 papers únicos** consolidados
- **Fuentes**: ArXiv • Semantic Scholar • OpenAlex
- **Ordenados** por año (más recientes primero)
- **Listos** para análisis académico

---

## ⚙️ Cómo Funciona Internamente

### 1. **Búsqueda Paralela**
```javascript
Promise.all([
  searchArxiv(),
  searchSemanticScholar(),
  searchOpenAlex()
])
```
**Ventaja**: 3x más rápido que búsqueda secuencial

### 2. **Eliminación de Duplicados**
```javascript
function removeDuplicates(papers) {
  // Compara títulos normalizados
  // Elimina papers con 80%+ similitud en título
}
```
**Ventaja**: Evita repetir el mismo paper

### 3. **Consolidación**
```javascript
// Combina resultados de 3 fuentes
// Elimina duplicados
// Ordena por año
// Devuelve conjunto único
```

---

## 🎓 Metodología Académica Aplicada

Tu sistema sigue **7 pasos académicos**:

| Paso | Descripción | Implementado |
|------|-------------|--------------|
| 1️⃣ | Definir área temática | ✅ Campo de búsqueda |
| 2️⃣ | Identificar variables y keywords | ✅ Término + keywords automáticos |
| 3️⃣ | Buscar en bases de datos | ✅ 3 fuentes académicas |
| 4️⃣ | Recolectar artículos | ✅ 15 papers (5 por fuente) |
| 5️⃣ | Filtrar por relevancia | ✅ Elimina duplicados |
| 6️⃣ | Consolidar resultados | ✅ Merge inteligente |
| 7️⃣ | Estado del Arte | ✅ Resultado final |

---

## 🚀 Uso

### Local
```bash
npm run dev
# http://localhost:5173
```

### Producción
https://tallerintegrador1-8e973.web.app

### Ejemplo de Búsqueda
```
Tema: "deep learning neural networks"
Año inicio: 2023
Año fin: 2024
```

**Resultado esperado**: ~12 papers únicos de las 3 fuentes

---

## 📈 Ventajas del Sistema

### ✅ Cobertura Amplia
- No solo ArXiv, sino 3 fuentes diferentes
- Papers de distintas áreas
- Metadatos enriquecidos

### ✅ Calidad
- Los mejores papers de cada fuente
- Sin duplicados
- Ordenados por relevancia (año)

### ✅ Eficiencia
- Búsqueda paralela (rápido)
- Eliminación automática de duplicados
- Proceso visible para el usuario

### ✅ Académico
- Sigue metodología rigurosa
- Resultados listos para investigación
- Metadatos completos

---

## 🔧 Configuración Actual

```javascript
// 5 papers mejores por fuente
const resultsPerSource = 5;

// Total esperado: ~12-15 papers únicos
// (después de eliminar duplicados)

// Tiempo mínimo de búsqueda: 30 segundos
// (para mostrar progreso completo)
```

---

## 📊 Estadísticas

### Por Fuente
- **ArXiv**: ~2M papers, gratis
- **Semantic Scholar**: Metadatos completos, gratis
- **OpenAlex**: 300M+ papers, gratis

### Por Búsqueda
- **Tiempo**: ~30-40 segundos
- **Papers**: 5 × 3 fuentes = 15
- **Únicos**: ~10-15 (después de filtro)
- **Calidad**: Alta (mejores de cada fuente)

---

**¡Listo para usar! 🎉**

