#!/bin/sh

# Script para esperar a que un servicio esté disponible en una IP:PUERTO
# Uso: ./wait-for.sh servicio puerto comando...

HOST="$1"
PORT="$2"

echo "⏳ Esperando a que $HOST:$PORT esté disponible..."

while ! nc -z "$HOST" "$PORT"; do
  sleep 1
done

echo "✅ $HOST:$PORT está disponible. Continuando..."

exec "${@:3}"
