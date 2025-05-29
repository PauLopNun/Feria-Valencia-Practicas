# Imagen base
FROM node:24-slim

# Instala netcat solo si usas wait-for (opcional)
RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean

# Establece el directorio de trabajo en el subdirectorio
WORKDIR /app

# Copia los archivos de dependencias
COPY . .

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código fuente
COPY . .

# Da permisos de ejecución al script start.sh (importante)
RUN chmod +x ./start.sh

# Expone el puerto de la aplicación (ajústalo si usas otro)
EXPOSE 3000

# Comando que se ejecuta al arrancar el contenedor
CMD ["sh", "./start.sh"]
