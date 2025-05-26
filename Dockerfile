# Usa una imagen oficial de Node.js
FROM node:18

# Crea y usa el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código de la app
COPY . .

# Da permisos de ejecución al script de inicio
RUN chmod +x start.sh

# Expone el puerto 3000
EXPOSE 3000

# Comando por defecto al iniciar el contenedor
CMD ["sh", "start.sh"]
