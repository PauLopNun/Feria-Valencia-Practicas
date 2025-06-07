# Prácticas de MJML – Feria Valencia

![Feria_De_Muestras](https://cdn1.valenciaciudaddelrunning.com/wp-content/uploads/2023/07/foto-principal-scaled.jpg)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![MJML](https://img.shields.io/badge/MJML-FD652F?style=flat&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)
![Responsive Design](https://img.shields.io/badge/Responsive--Design-0088CC?style=flat&logo=google-chrome&logoColor=white)

---

¡Hola! Soy **Pau**, y este es el repositorio donde he documentado mi trabajo con **MJML**, un framework potente para crear emails responsive.  
A lo largo de estas prácticas, he diseñado campañas de email marketing orientadas a eventos reales de **Feria Valencia**, aplicando tanto conocimientos técnicos como creatividad visual para resolver retos comunicativos específicos.

---

## 📌 Índice

- [🎯 Objetivo del Proyecto](#objetivo-del-proyecto)
- [📬 Casos Prácticos](#casos-prácticos-desarrollados)
- [🎨 Estética y Paleta](#estética-y-paleta-de-colores)
- [🗂️ Estructura del Repositorio](#estructura-del-repositorio)
- [🛠️ Tecnologías y Herramientas](#tecnologías-y-herramientas)
- [▶️ Cómo Ejecutar el Proyecto](#️cómo-ejecutar-el-proyecto)
- [🙏 Agradecimientos](#agradecimientos)
- [📫 Contacto](#contacto)

---

## 🎯 Objetivo del Proyecto

Diseñar boletines informativos realistas para distintos eventos de **Feria Valencia**, aplicando MJML de forma avanzada con un enfoque responsive, accesible y visualmente atractivo.

---

## 📬 Casos Prácticos Desarrollados

### 🔹 Salón del Cómic de València
> Campaña dirigida a un público joven, familiar y geek. El email utiliza una estética tipo cómic, con viñetas, gifs y botones llamativos. Se enfoca en resaltar preventas, actividades especiales y contenido visualmente compartible.

### 🔹 Feria Dos Ruedas
> Correo orientado a aficionados al motociclismo. Se promociona un sorteo de entradas para el GP de Cheste con una estética de competición: colores intensos, cuenta regresiva animada y CTA directo para motivar la inscripción.

### 🔹 Expojove – Servicios para Expositores
> Comunicación profesional para informar sobre servicios durante el evento (electricidad, limpieza, seguridad, etc.). Se prioriza la legibilidad, estructura clara y botones directos a formularios.

### 🔹 Cevisama – Comunicación a Expositores
> Comunicación B2B corporativa con novedades en internacionalización y fidelización. Diseño sobrio para empresas del sector cerámico y de baño.

---

## 🎨 Estética y Paleta de Colores

Aunque cada campaña tiene un estilo visual único, todas comparten una coherencia general basada en esta paleta:

| Color               | Uso                              |
|--------------------|-----------------------------------|
| `#4F6A44`           | Verde olivo – Fondos intensos     |
| `#F1E3C8`           | Crema suave – Legibilidad         |
| `#D79C56`           | Naranja tostado – Botones / CTA   |
| `#3C312E`           | Marrón oscuro – Texto principal   |
| `#8B453A` / `#6D7D8B` | Elementos secundarios y divisores |

Cada campaña adapta estos tonos con colores adicionales: rojo y amarillo (cómic), negro y metálico (motos), verde institucional (expojove), y azul corporativo (cevisama).

---

## 🗂️ Estructura del Repositorio

```plaintext
FERIA-VALENCIA-MJML/
├── assets/
├── data/
├── database/
│   └── init.sql
├── docs/
│   ├── Docker+Node.js+MJML.md
│   ├── info1.md ... info4.md
│   └── memorias por caso
├── src/
│   ├── index.js
│   ├── mailer.js
│   ├── output/
│   └── templates/
│       ├── Caso-1/
│       ├── Caso-2/
│       ├── Caso-3/
│       └── Caso-4/
├── .env.example
├── .dockerignore / .gitignore
├── docker-compose.yml / Dockerfile
├── package.json / package-lock.json
└── tutorial.md
```

---

## 🛠️ Tecnologías y Herramientas

- **MJML** → Maquetación responsive para emails  
- **Node.js + Express** → Backend y automatización  
- **PostgreSQL** → Gestión de suscriptores y almacenaje  
- **Nodemailer** → Envío automático de emails  
- **Docker** → Entorno de desarrollo reproducible  
- **GitHub** → Control de versiones y documentación  
- **Outlook / Mailjet** → Testing de compatibilidad real

---

## ▶️ Cómo Ejecutar el Proyecto

1. Clona este repositorio

```bash
git clone https://github.com/paulopnun/Newsletter-Automatizada-Local
cd Newsletter-Automatizada-Local
```

2. Crea un archivo `.env` a partir de `.env.example` con tus credenciales

3. Lanza el entorno Dockerizado

```bash
docker-compose up --build
```

4. Abre `http://localhost:3000` para previsualizar las newsletters generadas.

---

## 🙏 Agradecimientos

Gracias a **Feria Valencia** por aportar contextos realistas y al profesorado del **IES La Sénia** por fomentar un aprendizaje basado en retos.  
Este proyecto me ha permitido aplicar diseño responsive y automatización en un entorno profesional, realista y desafiante.

---

## 📫 Contacto

**Pau López Núñez**  
[📧 paulopnun@gmail.com](mailto:paulopnun@gmail.com)  
[🔗 GitHub](https://github.com/paulopnun) • [🔗 LinkedIn](https://www.linkedin.com/in/paulopnun)

---

**¡Gracias por visitar este repositorio!**  
Si tienes sugerencias o quieres colaborar, ¡no dudes en abrir un issue o contactarme!
