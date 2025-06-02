#!/bin/sh

echo "⏳ Esperando a que MySQL esté listo..."

echo "🔄 Generando newsletters con index.js..."
node src/index.js

# Tiene que estar en formato LF