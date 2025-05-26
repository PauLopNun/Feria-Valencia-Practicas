#!/bin/sh

echo "🔄 Generando newsletters con index.js..."
node index.js

echo "🚀 Iniciando servidor Express con server.js..."
exec node server.js
