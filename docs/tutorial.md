# 📬 Proyecto Newsletter - Feria Valencia

Este proyecto permite gestionar el envío de newsletters automáticas usando **Node.js**, **MJML**, **MySQL** y **Docker** en local.

---

## Cómo usar este proyecto

### 1. 🐳 Instala Docker y Git

Asegúrate de tener instalados:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/downloads)

---

### 2. 📥 Clona el repositorio

```bash
git clone https://github.com/PauLopNun/Feria-Valencia-Practicas
cd Feria-Valencia-Practicas
```

---

### 3. ⚙️ Crea el archivo `.env`

En la raíz del proyecto, crea un archivo llamado `.env` con este contenido:

```env
# Base de datos
DB_HOST=mysql-db
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_NAME=newsletter

# Gmail (correo del remitente y contraseña de aplicación)
GMAIL_USER=tuemail@gmail.com
GMAIL_PASS=tu_contraseña_de_aplicacion
```

🔐 **Nota**: Usa una [contraseña de aplicación de Google](https://support.google.com/accounts/answer/185833?hl=es) y **no** tu contraseña de Gmail normal.

---

### 4. 🧱 Ejecuta Docker

Desde la terminal (estando en el directorio del proyecto), ejecuta los siguientes comandos:

```bash
docker-compose down --volumes --remove-orphans
docker-compose build --no-cache
docker-compose up
```

---

### ✅ ¡Todo listo!

Tu sistema de newsletter estará corriendo:

- Servidor Backend: http://localhost:3000 
- Base de datos MySQL: interna en el contenedor `mysql-db:3306`
- MJML + NodeMailer: listos para generar y enviar correos

---

## 🛠️ Problemas comunes

- Asegúrate de que **WSL2 está correctamente instalado y configurado** si usas Docker en Windows.
- Verifica que el archivo `.env` esté correctamente escrito y guardado (sin espacios adicionales).
- Si Docker no arranca, prueba `wsl --shutdown` y reinicia Docker Desktop.

---


¡Gracias por usar este proyecto! Si tienes mejoras, no dudes en hacer un pull request 🙌