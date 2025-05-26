# Usa una imagen oficial de Node.js
FROM node:18

# Crea y usa el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto de tu app (ajusta si usas otro)
EXPOSE 3000

# Comando por defecto
CMD ["npm", "start"]
