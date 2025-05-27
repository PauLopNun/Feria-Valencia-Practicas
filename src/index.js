const fs = require('fs');
const path = require('path');
const mjml = require('mjml');
const mysql = require('mysql2');
const express = require('express');

const baseDir = path.join(__dirname, '..', 'templates');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'feria_valencia',
  port: process.env.DB_PORT || 3306
});

connection.connect(err => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
    return;
  }
  console.log('✅ Conectado a MySQL');

  // Crear tabla templates si no existe
  connection.query(`
    CREATE TABLE IF NOT EXISTS templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) UNIQUE,
      contenido LONGTEXT
    )
  `, err => {
    if (err) throw err;

    // Leer carpetas Caso-* en templates y compilar MJML a HTML, guardar en disco y DB
    fs.readdir(baseDir, { withFileTypes: true }, (err, entries) => {
      if (err) throw err;

      const casos = entries.filter(e => e.isDirectory() && e.name.startsWith('Caso-'));

      casos.forEach(caso => {
        const casoPath = path.join(baseDir, caso.name);

        fs.readdir(casoPath, (err, files) => {
          if (err) throw err;

          files.filter(f => f.endsWith('.mjml')).forEach(file => {
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
            const contenidoHTML = result.html;

            const sql = `
              INSERT INTO templates (nombre, contenido) VALUES (?, ?)
              ON DUPLICATE KEY UPDATE contenido = VALUES(contenido)
            `;

            connection.query(sql, [nombreTemplate, contenidoHTML], err => {
              if (err) throw err;
              console.log(`✅ HTML de ${file} insertado o actualizado en MySQL`);
            });
          });
        });
      });
    });
  });

  // Crear tabla suscriptores con columna tiempo_respuesta tipo DATE
  connection.query(`
    CREATE TABLE IF NOT EXISTS suscriptores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100),
      email VARCHAR(255),
      empresa VARCHAR(255),
      idioma VARCHAR(10),
      tiempo_respuesta DATE DEFAULT NULL
    )
  `, err => {
    if (err) throw err;
    console.log('🗃️ Tabla "suscriptores" asegurada');
  });
});

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

// Importar función de envío de correos
const { enviarNewsletters } = require('./mailer');

// Esperar 5 segundos y luego lanzar el envío de newsletters
setTimeout(() => {
  connection.query('SELECT nombre, email, empresa, idioma, tiempo_respuesta FROM suscriptores', (err, results) => {
    if (err) {
      console.error('❌ Error leyendo suscriptores:', err);
      return;
    }

    // Formatear tiempo_respuesta a formato legible en español (ej: 15 de noviembre de 2025)
    results.forEach(suscriptor => {
      if (suscriptor.tiempo_respuesta) {
        const fecha = new Date(suscriptor.tiempo_respuesta);
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        suscriptor.tiempo_respuesta = fecha.toLocaleDateString('es-ES', opciones);
      }
    });

    enviarNewsletters(results);
  });
}, 5000);
