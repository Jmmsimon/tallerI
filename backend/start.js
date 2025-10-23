#!/usr/bin/env node

/**
 * Script de inicio para el backend
 * Verifica la configuración y inicia el servidor
 */

const config = require('./src/config');
const n8nService = require('./src/services/n8nService');

console.log('🚀 Iniciando Backend - Integración con n8n');
console.log('==========================================');

// Verificar configuración
console.log('\n📋 Verificando configuración...');

const configStatus = n8nService.validateConfig();
if (!configStatus.isValid) {
  console.error('❌ Configuración incompleta:');
  configStatus.issues.forEach(issue => {
    console.error(`   - ${issue}`);
  });
  console.error('\n💡 Crea un archivo .env basado en env.example');
  process.exit(1);
}

console.log('✅ Configuración válida');

// Mostrar información de configuración
console.log('\n⚙️  Configuración actual:');
console.log(`   - Puerto: ${config.server.port}`);
console.log(`   - Entorno: ${config.server.env}`);
console.log(`   - n8n URL: ${config.n8n.baseURL}`);
console.log(`   - Frontend URL: ${config.cors.origin}`);
console.log(`   - Rate Limit: ${config.rateLimit.max} requests/${config.rateLimit.windowMs/1000/60}min`);

// Iniciar servidor
console.log('\n🌐 Iniciando servidor...');
require('./src/server');
