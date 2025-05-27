#!/bin/sh

echo "⏳ Esperando a que MySQL esté listo..."
sleep 5

echo "🔄 Generando newsletters con index.js..."
node src/index.js
