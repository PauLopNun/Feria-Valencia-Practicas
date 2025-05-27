const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Mapeo empresa → ruta newsletter HTML (ya convertidos de MJML a HTML)
const newsletterMap = {
  'Valencia Comics': path.join(__dirname, 'output', 'Caso-1', 'newsletter_salon_comic_valencia.html'),
  'UK Events': path.join(__dirname, 'output', 'Caso-2', 'Newsletter_Cevisama.html'),
  'Feria Joven': path.join(__dirname, 'output', 'Caso-3', 'Newsletter_Expojove.html'),
  'Feria Dos Ruedas': path.join(__dirname, 'output', 'Caso-4', 'Newsletter_Feria_2_Ruedas.html')
};

// Crear transporter de Nodemailer para Gmail
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
  } else {
    console.log('✅ Conexión a Gmail verificada correctamente');
  }
});

// Función para sustituir variables {{var}} en el template HTML
function personalizarContenido(template, datos) {
  return template.replace(/{{\s*([^}]+)\s*}}/g, (match, key) => {
    return datos[key] || ''; // si no hay valor, vacío
  });
}

// Función principal para enviar newsletters
async function enviarNewsletters(suscriptores) {
  console.log(`📨 Enviando newsletters a ${suscriptores.length} suscriptores...`);
  for (const suscriptor of suscriptores) {
    const empresa = suscriptor.empresa ? suscriptor.empresa.trim() : '';
    const newsletterPath = newsletterMap[empresa];

    if (!newsletterPath || !fs.existsSync(newsletterPath)) {
      console.warn(`❌ No se encontró newsletter para empresa "${empresa}". Omitiendo a ${suscriptor.email}`);
      continue;
    }

    // Leer contenido HTML
    let htmlContent = fs.readFileSync(newsletterPath, 'utf8');

    // Personalizar variables con datos del suscriptor
    htmlContent = personalizarContenido(htmlContent, suscriptor);

    const mailOptions = {
      from: `"Feria Valencia" <${process.env.GMAIL_USER}>`,
      to: suscriptor.email,
      subject: 'Tu Newsletter de Feria Valencia',
      html: htmlContent
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Correo enviado a ${suscriptor.email}: ${info.response}`);
    } catch (error) {
      console.error(`❌ Error enviando a ${suscriptor.email}:`, error);
    }
  }
}

module.exports = { enviarNewsletters };
