# 🚀 Configuración de Gemini AI para Búsqueda PICO

## Descripción

El sistema ahora incluye búsqueda PICO integrada con Google Gemini AI para generar keywords automáticamente a partir de preguntas de investigación clínica.

## 📋 ¿Qué es PICO?

PICO es una metodología estándar en investigación médica para formular preguntas clínicas:

- **P** (Población): ¿Quiénes son los pacientes o población de interés?
- **I** (Intervención): ¿Cuál es la intervención o tratamiento a evaluar?
- **C** (Comparación): ¿Con qué se compara la intervención?
- **O** (Outcome): ¿Cuál es el resultado o desenlace que se mide?

## ⚙️ Configuración

### 1. Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Clic en "Get API Key" o "Create API Key"
4. Copia tu API key

### 2. Configurar Variable de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

Edita el archivo `.env` y agrega tu API key:

```env
VITE_GEMINI_API_KEY=tu_api_key_aqui_sin_espacios
```

### 3. Reiniciar el Servidor

```bash
# Detener el servidor (Ctrl+C)
npm run dev
```

## 📝 Cómo Usar Búsqueda PICO

### Paso 1: Cambiar a Modo PICO
1. En la página principal, usa el tab **"🧬 Búsqueda PICO"**
2. Se mostrarán los 4 campos del formulario PICO

### Paso 2: Completar el Formulario PICO

Ejemplo:
- **P (Población)**: "Pacientes con cáncer de pulmón"
- **I (Intervención)**: "Uso de Deep Learning para detectar nódulos"
- **C (Comparación)**: "Radiólogos expertos"
- **O (Outcome)**: "Precisión del diagnóstico"

### Paso 3: Generar Keywords con IA

1. Clic en el botón **"✨ Generar Keywords con IA"** (botón morado)
2. Espera a que Gemini genere las keywords
3. Las keywords aparecerán en un cuadro azul debajo del botón

Ejemplo de keywords generadas:
```
lung cancer, pulmonary nodules, CNN, radiologist comparison, diagnostic accuracy
```

### Paso 4: Completar Años y Cantidad

1. Ingresa el **Año inicio** y **Año fin**
2. Selecciona la **Cantidad máxima de resultados** (1-20)
3. Clic en **"Buscar"**

### Paso 5: Ver Resultados

El sistema buscará papers científicos usando las keywords generadas por Gemini AI en todas las fuentes académicas.

## 🔧 Troubleshooting

### Error: "GEMINI_API_KEY no está configurada"
- Verifica que el archivo `.env` existe en la raíz del proyecto
- Verifica que la variable se llama `VITE_GEMINI_API_KEY` (no `GEMINI_API_KEY`)
- Reinicia el servidor después de crear el archivo `.env`

### Error: "Error al generar keywords con Gemini"
- Verifica que tu API key es válida
- Verifica tu conexión a internet
- Revisa la consola del navegador para más detalles

## 🎯 Ventajas de Búsqueda PICO

- ✅ Keywords más precisas generadas por IA
- ✅ Formulario estructurado para investigación clínica
- ✅ Mejor orientado a preguntas de investigación médica
- ✅ Integración directa con múltiples fuentes académicas

## 📚 Fuentes Consultadas

El sistema busca en:
- **Semantic Scholar**: Metadatos académicos y citas
- **OpenAlex**: Índice académico abierto
- **ArXiv**: Preprints científicos

