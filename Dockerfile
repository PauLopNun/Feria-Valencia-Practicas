FROM node:24-slim

# Instala netcat-openbsd para que wait-for.sh funcione
RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean

WORKDIR /app

COPY package*.json ./

# Instala todas las dependencias necesarias, incluyendo dotenv y csv-parser
RUN npm install mjml mysql2 express csv-parser nodemailer dotenv

COPY . .

RUN chmod +x wait-for.sh

EXPOSE 3000

# Esperar a que MySQL esté disponible antes de arrancar
ENTRYPOINT ["./wait-for.sh", "mysql-db", "3306"]
CMD ["sh", "./start.sh"]
