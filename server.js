const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Ruta a la carpeta de output
const outputPath = path.join(__dirname, 'output');

// Middleware para servir archivos estáticos
app.use('/output', express.static(outputPath));

// Página principal que lista todos los HTML generados
app.get('/', (req, res) => {
  fs.readdir(outputPath, (err, folders) => {
    if (err) return res.status(500).send('❌ Error leyendo la carpeta output');

    let html = `
      <h1>Correos generados</h1>
      <ul style="font-family: sans-serif;">
    `;

    folders.forEach(folder => {
      const folderPath = path.join(outputPath, folder);
      if (fs.statSync(folderPath).isDirectory()) {
        const files = fs.readdirSync(folderPath);
        files.forEach(file => {
          if (file.endsWith('.html')) {
            const relativePath = `/output/${folder}/${file}`;
            html += `<li><a href="${relativePath}" target="_blank">${file}</a></li>`;
          }
        });
      }
    });

    html += '</ul>';
    res.send(html);
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌐 Servidor Express iniciado en http://localhost:${PORT}`);
});

