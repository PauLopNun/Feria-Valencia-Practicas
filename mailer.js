const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const nodemailer = require('nodemailer');

// 📌 Mapeo de empresa → ruta de newsletter
const newsletterMap = {
  'Valencia Comics': path.join(__dirname, 'output', 'Caso#1', 'newsletter_salon_comic_valencia.html'),
  'UK Events': path.join(__dirname, 'output', 'Caso#2', 'Newsletter_Cevisama.html'),
  'Feria Joven': path.join(__dirname, 'output', 'Caso#3', 'Newsletter_Expojove.html'),
  'Feria Dos Ruedas': path.join(__dirname, 'output', 'Caso#4', 'Newsletter_Feria_2_Ruedas.html')
};

// ✅ Comprobación de variables de entorno
console.log('📧 Comprobando variables de entorno...');
console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? '✓ cargada' : '✗ vacía');

// 📨 Configuración de transporte
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// ✅ Verificar conexión con Gmail
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Fallo al conectar con Gmail:', error);
    return;
  }
  console.log('✅ Conexión a Gmail verificada correctamente');
  
  // 📥 Leer CSV una vez que Gmail está verificado
  const csvPath = path.join(__dirname, 'suscriptores.csv');
  const suscriptores = [];

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', data => suscriptores.push(data))
    .on('end', () => {
      console.log('📨 Enviando newsletters a:');
      console.table(suscriptores);

      suscriptores.forEach(suscriptor => {
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
