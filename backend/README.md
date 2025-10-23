# Backend - Integración con n8n

Este backend proporciona una API REST para realizar búsquedas de papers científicos utilizando la integración con n8n.

## 🚀 Características

- **API REST** para búsquedas de papers científicos
- **Integración con n8n** para automatización de búsquedas
- **Validación de datos** con Joi
- **Rate limiting** para protección contra abuso
- **CORS configurado** para comunicación con frontend
- **Manejo de errores** robusto
- **Logging** con Morgan
- **Seguridad** con Helmet

## 📋 Requisitos

- Node.js >= 16.0.0
- npm o yarn
- n8n instalado y configurado
- Workflow de n8n para búsqueda de papers

## 🛠️ Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp env.example .env
   ```
   
   Editar el archivo `.env` con tus configuraciones:
   ```env
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   N8N_BASE_URL=http://localhost:5678
   N8N_API_KEY=tu_api_key_aqui
   N8N_WORKFLOW_ID=tu_workflow_id_aqui
   ```

3. **Iniciar el servidor:**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## 📚 API Endpoints

### Health Check
- **GET** `/health` - Estado del servidor

### Búsquedas
- **POST** `/api/search/papers` - Búsqueda de papers (JSON body)
- **GET** `/api/search/papers` - Búsqueda de papers (query params)
- **GET** `/api/search/status` - Estado del workflow de n8n
- **GET** `/api/search/config` - Configuración del servicio
- **POST** `/api/search/test` - Prueba de conectividad

### Ejemplo de búsqueda POST:
```json
{
  "topic": "machine learning",
  "startYear": 2023,
  "endYear": 2024,
  "maxResults": 50
}
```

### Ejemplo de búsqueda GET:
```
GET /api/search/papers?topic=machine%20learning&startYear=2023&endYear=2024&maxResults=50
```

## 🔧 Configuración de n8n

### Variables de entorno requeridas:

1. **N8N_BASE_URL**: URL base de tu instancia de n8n
2. **N8N_API_KEY**: API key para autenticación con n8n
3. **N8N_WORKFLOW_ID**: ID del workflow que realizará las búsquedas

### Estructura esperada del workflow de n8n:

El workflow debe recibir los siguientes parámetros:
```json
{
  "topic": "string",
  "startYear": "number",
  "endYear": "number", 
  "maxResults": "number"
}
```

Y debe retornar:
```json
{
  "papers": [
    {
      "id": "string",
      "year": "number",
      "title": "string",
      "authors": "string",
      "doi": "string",
      "url": "string",
      "source": "string",
      "pdf": "string",
      "abstract": "string",
      "keywords": ["string"],
      "citationCount": "number",
      "impactFactor": "number"
    }
  ],
  "searchInfo": {
    "query": "string",
    "totalFound": "number",
    "searchTime": "string",
    "sources": ["string"]
  }
}
```

## 🧪 Testing

```bash
# Ejecutar pruebas
npm test

# Prueba de conectividad
curl -X POST http://localhost:3001/api/search/test
```

## 📝 Logs

El servidor utiliza Morgan para logging. Los logs incluyen:
- Requests HTTP
- Errores de conexión
- Tiempos de respuesta
- Estados de búsquedas

## 🔒 Seguridad

- **Rate limiting**: 100 requests por 15 minutos por IP
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configurado para el frontend específico
- **Validación**: Todos los inputs son validados con Joi

## 🐛 Troubleshooting

### Error de conexión con n8n:
1. Verificar que n8n esté ejecutándose
2. Confirmar la URL base en `N8N_BASE_URL`
3. Verificar la API key en `N8N_API_KEY`

### Error de workflow:
1. Confirmar que el workflow ID existe
2. Verificar que el workflow esté activo
3. Revisar la estructura de datos del workflow

### Error de CORS:
1. Verificar `FRONTEND_URL` en las variables de entorno
2. Confirmar que el frontend esté ejecutándose en la URL correcta

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades, crear un issue en el repositorio.
