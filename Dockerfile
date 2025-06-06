# Imagen base
FROM node:24-slim

# Instala netcat solo si lo necesitas
RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean

# Establece el directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json primero para usar cache de Docker
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código fuente
COPY . .

# Da permisos de ejecución al script start.sh (asegúrate que tiene formato LF)
RUN chmod +x ./start.sh

# Expone el puerto
EXPOSE 3000

# Comando por defecto
CMD ["sh", "./start.sh"]
