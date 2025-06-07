require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mjml = require('mjml');
const mysql = require('mysql2/promise');
const express = require('express');
const { enviarNewsletters } = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3000;
const baseDir = path.join(__dirname, 'templates');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-db',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'newsletter',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function init() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Conectado a MySQL');

    // Reiniciar tabla suscriptores
    await conn.query(`DROP TABLE IF EXISTS suscriptores;`);

    // Crear tablas
    await conn.query(`
      CREATE TABLE IF NOT EXISTS templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) UNIQUE,
        contenido TEXT
      );
    `);

    await conn.query(`
      CREATE TABLE suscriptores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100),
        email VARCHAR(255) UNIQUE,
        empresa VARCHAR(255),
        idioma VARCHAR(10),
        tiempo_respuesta DATE DEFAULT NULL
      );
    `);

    // Procesar y guardar templates
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });
    const casos = entries.filter(e => e.isDirectory() && e.name.startsWith('Caso-'));

    for (const caso of casos) {
      const casoPath = path.join(baseDir, caso.name);
      const files = fs.readdirSync(casoPath).filter(f => f.endsWith('.mjml'));

      for (const file of files) {
        const inputPath = path.join(casoPath, file);
        const mjmlContent = fs.readFileSync(inputPath, 'utf8');
        const result = mjml(mjmlContent);

        if (result.errors.length) {
          console.warn(`⚠️ Errores en MJML de ${file}:`, result.errors);
        }

        const outputDir = path.join(__dirname, 'output', caso.name);
        fs.mkdirSync(outputDir, { recursive: true });

        const outputPath = path.join(outputDir, file.replace('.mjml', '.html'));
        fs.writeFileSync(outputPath, result.html);
        console.log(`✅ HTML generado: ${outputPath}`);

        const nombreTemplate = `${caso.name}/${file.replace('.mjml', '.html')}`;
        await conn.query(`
          INSERT INTO templates (nombre, contenido)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE contenido = VALUES(contenido)
        `, [nombreTemplate, result.html]);
      }
    }

    // Insertar suscriptores
    await conn.query(`
      INSERT INTO suscriptores (nombre, email, empresa, idioma, tiempo_respuesta) VALUES
        ('Pau', 'paulopeznunez@gmail.com', 'Valencia Comics', 'es', '2025-11-15'),
        ('Elena', 'elenalablan@gmail.com', 'Feria Joven', 'es', '2025-11-15'),
        ('Roberto', 'robertomoramoreno3@gmail.com', 'UK Events', 'en', '2025-11-15'),
        ('Moha', 'mohamed.shahin1703@gmail.com', 'Feria Joven', 'es', '2025-11-15'),
        ('Ruben', 'rubenramirezcatalu@gmail.com', 'Feria Dos Ruedas', 'es', '2025-11-15')
      ON DUPLICATE KEY UPDATE nombre = VALUES(nombre)
    `);

    console.log("✅ Suscriptores insertados correctamente");
    conn.release();
  } catch (err) {
    console.error('❌ Error durante la inicialización:', err);
  }
}

/*Está bien tener las imágenes en express pero si lo vas a ejecutar en local
hay que tener en cuenta que cuando se manden los correos no cargaran, tendras 
que usar rutas de imágenes que estén en un servidor como Render, url de internet
o Imgur por ejemplo*/

app.use(express.static(path.join(__dirname, 'output')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.get('/', (req, res) => {
  const outputBase = path.join(__dirname, 'output');
  const imagesDir = path.join(__dirname, 'public/images');

  let html = '<h1>📬 Newsletters generadas</h1><ul>';

  if (fs.existsSync(outputBase)) {
    const casos = fs.readdirSync(outputBase, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const caso of casos) {
      const archivos = fs.readdirSync(path.join(outputBase, caso)).filter(f => f.endsWith('.html'));
      for (const archivo of archivos) {
        html += `<li><a href="/${caso}/${archivo}">${caso}/${archivo}</a></li>`;
      }
    }
  } else {
    html += '<li>No hay newsletters generadas todavía.</li>';
  }

  html += '</ul>';

  if (fs.existsSync(imagesDir)) {
    const imagenes = fs.readdirSync(imagesDir).filter(f =>
      f.match(/\.(png|jpe?g|gif)$/i)
    );

    if (imagenes.length) {
      html += '<h2>🖼️ Imágenes disponibles</h2><div style="display: flex; gap: 10px; flex-wrap: wrap;">';
      for (const img of imagenes) {
        html += `
          <div style="text-align: center;">
            <img src="/images/${img}" alt="${img}" width="150" />
            <p>${img}</p>
          </div>`;
      }
      html += '</div>';
    }
  }

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
});

// Control para evitar múltiples envíos
let envioRealizado = false;

async function enviarTodo() {
  if (envioRealizado) {
    console.log('🚫 Envío ya realizado. Omitiendo.');
    return;
  }

  try {
    const [rows] = await pool.query('SELECT * FROM suscriptores');
    const suscriptores = rows.map(s => ({
      ...s,
      tiempo_respuesta: s.tiempo_respuesta
        ? new Date(s.tiempo_respuesta).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric'
          })
        : ''
    }));

    await enviarNewsletters(suscriptores);
    envioRealizado = true;
  } catch (err) {
    console.error('❌ Error al enviar newsletters:', err);
  }
}

// Inicialización y envío diferido
(async () => {
  await init();
  setTimeout(enviarTodo, 5000); // enviar después de 5 segundos
})();
