# 🔬 Buscador de Papers Científicos - Guía de Uso

## ✨ Funcionalidades Implementadas

### 1. Búsqueda Real en ArXiv
- 🔍 Integración directa con la API de ArXiv
- 📅 Filtrado automático por rango de años
- 🎯 Búsqueda en tiempo real de papers científicos reales
- 📊 Hasta 50 resultados por búsqueda

### 2. Filtrado y Ordenamiento
- 📆 **Filtro por año**: Muestra papers de un año específico
- 👤 **Filtro por autor**: Búsqueda por nombre de autor
- 🔄 **Ordenar por**: Año, Título o Autor
- ⬆️⬇️ **Orden**: Ascendente o Descendente

### 3. Exportación a PDF
- 📄 Descarga automática de resultados en formato PDF
- 📋 Incluye título, autores, año, DOI y URL
- 🎨 Formato profesional y organizado
- 💾 Nombre del archivo basado en el tema de búsqueda

### 4. Compartir en WhatsApp
- 💬 Compartir resultados vía WhatsApp
- 📱 Mensaje pre-formateado con detalles de la búsqueda

## 🚀 Cómo Usar

### Paso 1: Ingresa tu Tema de Búsqueda
- Ve a la página principal
- Escribe el tema que te interesa (ej: "machine learning", "quantum computing", "artificial intelligence")
- Ejemplo: `deep learning in medical diagnosis`

### Paso 2: Define el Rango de Años
- **Año de inicio**: Primer año del rango (ej: 2022)
- **Año final**: Último año del rango (ej: 2024)
- ⚠️ El rango no puede exceder 10 años

### Paso 3: Busca
- Haz clic en "Buscar"
- ⏳ Espera mientras el sistema busca en ArXiv
- Verás una barra de progreso con los pasos de búsqueda

### Paso 4: Explora los Resultados
- 📊 Verás una tabla con todos los papers encontrados
- Cada paper incluye:
  - 📅 Año de publicación
  - 📝 Título completo
  - 👥 Autores
  - 🔗 DOI/ID de ArXiv
  - 📚 Fuente (ArXiv)
  - 🔘 Acciones (Ver y descargar PDF)

### Paso 5: Filtra y Ordena (Opcional)
- Usa los controles de filtro en la parte superior
- **Filtrar por año**: Selecciona un año específico
- **Buscar por autor**: Escribe el nombre de un autor
- **Ordenar por**: Elige cómo ordenar los resultados
- **Orden**: Ascendente o Descendente

### Paso 6: Exporta o Comparte
- 📄 **Exportar PDF**: Descarga todos los resultados filtrados en PDF
- 💬 **Enviar a WhatsApp**: Comparte los resultados
- ↩️ **Nueva Búsqueda**: Regresa para buscar otro tema

## 📝 Ejemplos de Búsqueda

### Ejemplo 1: Inteligencia Artificial
```
Tema: artificial intelligence
Año inicio: 2023
Año fin: 2024
```

### Ejemplo 2: Computación Cuántica
```
Tema: quantum computing
Año inicio: 2022
Año fin: 2024
```

### Ejemplo 3: Medicina Personalizada
```
Tema: personalized medicine
Año inicio: 2023
Año fin: 2024
```

## 🔧 Arquitectura del Proyecto

### Frontend (Todo en el Cliente)
✅ **Ventaja**: Más rápido y simple para un proyecto escolar
✅ **Sin dependencias de backend**: Todo funciona en el navegador
✅ **ArXiv API**: Acceso directo a papers reales
✅ **Datos reales**: No hay datos de ejemplo

### Flujo de Datos
```
Usuario ingresa tema → Topic.jsx → arxivService.js → ArXiv API
                           ↓
                   Resultados filtrados → Resultados.jsx → UI
                           ↓
                    Usuario ve datos reales
```

## 🌐 Despliegue

### URL de Producción
- 🔗 **Live**: https://tallerintegrador1-8e973.web.app
- 📦 Desplegado en Firebase Hosting

### Comandos de Desarrollo
```bash
# Desarrollo local
npm run dev

# Construir para producción
npm run build

# Desplegar a Firebase
npm run deploy
```

## 📦 Tecnologías Usadas

- **React**: Framework frontend
- **Vite**: Build tool
- **ArXiv API**: Fuente de papers científicos
- **jsPDF**: Generación de PDFs
- **Tailwind CSS**: Estilos
- **SweetAlert2**: Alertas bonitas
- **Axios**: Llamadas HTTP a ArXiv

## 🎯 Características Especiales

### 🔍 Búsqueda Inteligente
- Busca en títulos, abstracts y autores
- Filtrado automático por fecha
- Resultados ordenados por fecha de publicación

### 📊 Información Detallada
Cada paper incluye:
- Título completo
- Lista de autores
- Resumen (abstract)
- Categoría de ArXiv
- Links a PDF y página web
- Fecha de publicación

### 🎨 UI/UX Moderna
- Diseño responsivo
- Animaciones suaves
- Colores profesionales
- Fácil de usar

## 💡 Consejos de Búsqueda

1. **Sé específico**: "machine learning" es mejor que "ai"
2. **Usa términos técnicos**: "convolutional neural networks" vs "deep learning"
3. **Combina palabras clave**: "cancer detection" AND "machine learning"
4. **Revisa los resultados**: Los títulos te dicen mucho
5. **Filtra después**: Primero obtén muchos resultados, luego filtra

## ❓ Preguntas Frecuentes

### ¿Qué es ArXiv?
ArXiv es un repositorio abierto de papers científicos antes de publicación en revistas.

### ¿Los papers son reales?
✅ Sí, todos son papers científicos reales de ArXiv.

### ¿Puedo descargar los PDFs?
✅ Sí, cada paper tiene un botón para descargar el PDF directamente de ArXiv.

### ¿Por qué solo 50 resultados?
Para mantener la aplicación rápida. Puedes ajustar el filtro por año para ver más.

### ¿Funciona sin internet?
❌ No, necesita conexión para acceder a la API de ArXiv.

## 🚀 Próximas Mejoras Posibles

- [ ] Guardar búsquedas favoritas
- [ ] Historial de búsquedas
- [ ] Filtro por categoría de ArXiv
- [ ] Exportar a Excel/CSV
- [ ] Email de resultados
- [ ] Búsqueda avanzada con operadores
- [ ] Modo offline con caché
- [ ] Traducción de títulos

---

**¡Listo para usar!** 🎉 Tu buscador de papers científicos está completamente funcional y desplegado.

