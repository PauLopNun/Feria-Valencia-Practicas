#!/bin/sh

# Dirección y puerto pasados como argumentos
HOST="$1"
PORT="$2"

# Eliminar los dos primeros argumentos (host y puerto)
shift 2

echo "⏳ Esperando a que MySQL esté disponible en $HOST:$PORT..."

until nc -z "$HOST" "$PORT"; do
  echo "🔄 MySQL no disponible aún... esperando 1s"
  sleep 1
done

echo "✅ MySQL disponible, arrancando app"

# Ejecutar el resto del comando (por ejemplo: node index.js)
exec "$@"
