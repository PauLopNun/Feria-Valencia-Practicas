const fs = require('fs');
const path = require('path');
const mjml = require('mjml');
const mysql = require('mysql2/promise');
const express = require('express');

require('dotenv').config();

const baseDir = path.join(__dirname, '..', 'templates');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'feria_valencia',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Esperar conexión con reintentos
async function esperarConexionDB(maxIntentos = 10, intervalo = 2000) {
  for (let i = 1; i <= maxIntentos; i++) {
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      console.log('✅ Conectado a MySQL');
      return;
    } catch (err) {
      console.log(`⏳ Esperando conexión a MySQL... Intento ${i}/${maxIntentos}`);
      await new Promise(res => setTimeout(res, intervalo));
    }
  }
  throw new Error('❌ No se pudo conectar a MySQL tras varios intentos.');
}

async function iniciarApp() {
  await esperarConexionDB();

  const conn = await pool.getConnection();

  // Crear tabla templates
  await conn.query(`
    CREATE TABLE IF NOT EXISTS templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) UNIQUE,
      contenido LONGTEXT
    )
  `);

  // Leer carpetas Caso-* y compilar MJML
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
        continue; // No insertamos si hay errores
      }

      const outputDir = path.join(__dirname, 'output', caso.name);
      fs.mkdirSync(outputDir, { recursive: true });

      const outputPath = path.join(outputDir, file.replace('.mjml', '.html'));
      fs.writeFileSync(outputPath, result.html);
      console.log(`✅ HTML generado: ${outputPath}`);

      const nombreTemplate = `${caso.name}/${file.replace('.mjml', '.html')}`;
      const contenidoHTML = result.html;

      await conn.query(
        `INSERT INTO templates (nombre, contenido)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE contenido = VALUES(contenido)`,
        [nombreTemplate, contenidoHTML]
      );
      console.log(`✅ HTML de ${file} insertado/actualizado en MySQL`);
    }
  }

  // Crear tabla suscriptores
  await conn.query(`
    CREATE TABLE IF NOT EXISTS suscriptores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100),
      email VARCHAR(255),
      empresa VARCHAR(255),
      idioma VARCHAR(10),
      tiempo_respuesta DATE DEFAULT NULL
    )
  `);
  console.log('🗃️ Tabla "suscriptores" asegurada');

  conn.release();

  // Express
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.static(path.join(__dirname, 'output')));

  app.get('/', (req, res) => {
    const outputBase = path.join(__dirname, 'output');
    if (!fs.existsSync(outputBase)) {
      return res.send('<h1>No hay newsletters generadas todavía.</h1>');
    }

    const casos = fs.readdirSync(outputBase, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    let html = '<h1>📬 Newsletters generados</h1><ul>';
    casos.forEach(caso => {
      const casoPath = path.join(outputBase, caso);
      const archivos = fs.readdirSync(casoPath).filter(file => file.endsWith('.html'));
      archivos.forEach(archivo => {
        html += `<li><a href="/${caso}/${archivo}">${caso}/${archivo}</a></li>`;
      });
    });
    html += '</ul>';
    res.send(html);
  });

  app.listen(PORT, () => {
    console.log(`🌐 Servidor disponible en: http://localhost:${PORT}`);
  });

  // Enviar newsletters después de arrancar
  const { enviarNewsletters } = require('./mailer');

  setTimeout(async () => {
    try {
      const [suscriptores] = await pool.query(
        'SELECT nombre, email, empresa, idioma, tiempo_respuesta FROM suscriptores'
      );

      suscriptores.forEach(suscriptor => {
        if (suscriptor.tiempo_respuesta) {
          const fecha = new Date(suscriptor.tiempo_respuesta);
          const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
          suscriptor.tiempo_respuesta = fecha.toLocaleDateString('es-ES', opciones);
        }
      });

      await enviarNewsletters(suscriptores);
    } catch (err) {
      console.error('❌ Error leyendo o enviando newsletters:', err);
    }
  }, 5000);
}

iniciarApp().catch(err => {
  console.error('❌ Error al iniciar la app:', err);
});
