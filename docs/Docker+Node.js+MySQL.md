# Creación del Contenedor y Funcionalidades Implementadas

## 1. Creación del Contenedor Docker para la Aplicación Node.js

### Objetivo
Empaquetar la aplicación Node.js para que se ejecute de forma aislada y consistente usando Docker.

### Pasos realizados

- **Dockerfile**: Creación del archivo `Dockerfile` con las siguientes instrucciones:
  - Usar la imagen base oficial de Node.js (versión 18).
  - Establecer el directorio de trabajo en `/app`.
  - Copiar los archivos `package.json` y `package-lock.json` para instalar dependencias.
  - Ejecutar `npm install` para instalar los módulos necesarios.
  - Copiar el resto del código fuente al contenedor.
  - Definir el comando por defecto para ejecutar la aplicación: `npm start`.

```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
```

## 2. Configuración de package.json

Se agregó el script `"start": "node index.js"` para que Docker y otros entornos sepan cómo iniciar la aplicación con un solo comando.

Se definieron las dependencias clave para el proyecto:

- `mjml` para la conversión de plantillas MJML a HTML.
- `mysql2` para la conexión y manipulación de datos en MySQL.

Ejemplo relevante de `package.json`:

```json
{
  "name": "feria-valencia-practicas",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "mjml": "^4.15.3",
    "mysql2": "^3.14.1"
  }
}
```

## 3. Configuración del Servicio en docker-compose.yml

Se configuró el servicio `feria-node` para construir la imagen Docker y levantar el contenedor.

Se definió un servicio de base de datos MySQL (`mysql-db`) para almacenar los newsletters.

Se configuró la red por defecto para que ambos servicios puedan comunicarse.

Se añadió un volumen para compartir la carpeta `/app/output` del contenedor con la carpeta local `./output`, permitiendo acceder a los archivos HTML generados desde el host.

Ejemplo simplificado:

```yaml
version: "3.8"
services:
  mysql-db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: yourpassword
      MYSQL_DATABASE: newslettersdb
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

  feria-node:
    build: .
    depends_on:
      - mysql-db
    volumes:
      - ./output:/app/output
    ports:
      - "3000:3000"

volumes:
  mysql-data:
```

## 4. Implementación de la Lógica en index.js

### Funcionalidad

- **Conexión a MySQL**: Se utiliza el paquete `mysql2` para conectar con la base de datos.
- **Lectura y conversión de plantillas MJML**: Se leen archivos `.mjml` y se convierten a HTML con `mjml`.
- **Generación y guardado de archivos HTML**: Los HTML generados se guardan en carpetas organizadas (`/app/output/Caso#X/`).
- **Inserción en base de datos**: Se almacena el contenido HTML en la base de datos.
- **Logs informativos**: Se imprimen mensajes para confirmar la conexión, generación y almacenamiento.

### Resultado esperado

Al iniciar el contenedor, se genera automáticamente el HTML y se guarda en disco y en la base de datos.

## 5. Construcción y Ejecución del Contenedor

Construir la imagen sin usar cache:

```bash
docker-compose build --no-cache
```

Levantar los servicios en segundo plano:

```bash
docker-compose up -d
```

Revisar los logs del contenedor Node.js:

```bash
docker logs feria-node
```

Mensaje esperado:

```bash
✅ Conectado a MySQL
✅ HTML generado: /app/output/Caso#3/Newsletter_Expojove.html
✅ HTML generado: /app/output/Caso#2/Newsletter_Cevisama.html
✅ HTML generado: /app/output/Caso#1/newsletter_salon_comic_valencia.html
✅ HTML generado: /app/output/Caso#4/Newsletter_Feria_2_Ruedas.html
✅ HTML de Newsletter_Expojove.mjml insertado en MySQL
✅ HTML de Newsletter_Cevisama.mjml insertado en MySQL
✅ HTML de newsletter_salon_comic_valencia.mjml insertado en MySQL
✅ HTML de Newsletter_Feria_2_Ruedas.mjml insertado en MySQL
```

## 6. Visualización y Uso

Los archivos HTML están en `./output`, sincronizados con `/app/output` del contenedor.

Pueden abrirse en el navegador. La base de datos MySQL almacena los newsletters para su uso futuro.

## 7. Próximos Pasos

- Añadir un servidor web en Node.js para servir los newsletters vía HTTP.
- Crear una API REST para facilitar el acceso y gestión de newsletters.
- Implementar pruebas automáticas para validar la generación y almacenamiento.
- Documentar la estructura de la base de datos y el formato de las plantillas MJML.


- version 1.0