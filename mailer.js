const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');

// 📌 Mapeo de empresa → ruta de newsletter
const newsletterMap = {
  'Valencia Comics': path.join(__dirname, 'output', 'Caso-1', 'newsletter_salon_comic_valencia.html'),
  'UK Events': path.join(__dirname, 'output', 'Caso-2', 'Newsletter_Cevisama.html'),
  'Feria Joven': path.join(__dirname, 'output', 'Caso-3', 'Newsletter_Expojove.html'),
  'Feria Dos Ruedas': path.join(__dirname, 'output', 'Caso-4', 'Newsletter_Feria_2_Ruedas.html')
};

// ✅ Configurar conexión a MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  port: process.env.DB_PORT || 3306
});

// ✅ Comprobar credenciales Gmail
console.log('📧 Comprobando variables de entorno...');
console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? '✓ cargada' : '✗ vacía');

// 📨 Configurar transporte
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Fallo al conectar con Gmail:', error);
    return;
  }
  console.log('✅ Conexión a Gmail verificada correctamente');

  // 📤 Leer suscriptores desde MySQL
  connection.query('SELECT * FROM suscriptores', (err, rows) => {
    if (err) {
      console.error('❌ Error al leer suscriptores desde MySQL:', err);
      return;
    }

    console.log('📨 Enviando newsletters a:');
    console.table(rows);

    rows.forEach(suscriptor => {
      const empresa = suscriptor.empresa.trim();
      const newsletterPath = newsletterMap[empresa];

      if (!newsletterPath || !fs.existsSync(newsletterPath)) {
        console.warn(`❌ No se encontró newsletter para empresa "${empresa}". Se omite a ${suscriptor.email}`);
        return;
      }

      const htmlContent = fs.readFileSync(newsletterPath, 'utf8');

      const mailOptions = {
        from: `"Feria Valencia" <${process.env.GMAIL_USER}>`,
        to: suscriptor.email,
        subject: 'Tu Newsletter de Feria Valencia',
        html: htmlContent
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.error(`❌ Error enviando a ${suscriptor.email}:`, error);
        }
        console.log(`✅ Correo enviado a ${suscriptor.email}: ${info.response}`);
      });
    });
  });
});
