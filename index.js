const fs = require('fs');
const path = require('path');
const mjml = require('mjml');
const mysql = require('mysql2');
const express = require('express');

// Ruta base donde están las carpetas Caso#1, Caso#2, etc.
const baseDir = path.join(__dirname, 'src');

// Conexión a la base de datos usando variables de entorno
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || ''
});

connection.connect(err => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
    return;
  }
  console.log('✅ Conectado a MySQL');

  // Crear tabla si no existe
  connection.query(`
    CREATE TABLE IF NOT EXISTS templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255),
      contenido LONGTEXT
    )
  `, err => {
    if (err) throw err;

    // Leer carpetas Caso#1, Caso#2, ...
    fs.readdir(baseDir, { withFileTypes: true }, (err, entries) => {
      if (err) throw err;

      const casos = entries.filter(e => e.isDirectory() && e.name.startsWith('Caso'));

      casos.forEach(caso => {
        const casoPath = path.join(baseDir, caso.name);

        fs.readdir(casoPath, (err, files) => {
          if (err) throw err;

          files.filter(f => f.endsWith('.mjml')).forEach(file => {
            const inputPath = path.join(casoPath, file);
            const mjmlContent = fs.readFileSync(inputPath, 'utf8');
            const result = mjml(mjmlContent);

            const outputDir = path.join(__dirname, 'output', caso.name);
            fs.mkdirSync(outputDir, { recursive: true });

            const outputPath = path.join(outputDir, file.replace('.mjml', '.html'));
            fs.writeFileSync(outputPath, result.html);
            console.log(`✅ HTML generado: ${outputPath}`);

            connection.query(
              'INSERT INTO templates (nombre, contenido) VALUES (?, ?)',
              [`${caso.name}/${file}`, result.html],
              err => {
                if (err) throw err;
                console.log(`✅ HTML de ${file} insertado en MySQL`);
              }
            );
          });
        });
      });
    });
  });
});

// ------------------- EXPRESS PARA VER LOS HTML -------------------
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde /output
app.use(express.static(path.join(__dirname, 'output')));

// Página de inicio con lista de enlaces
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
