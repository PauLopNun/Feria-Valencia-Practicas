CREATE TABLE IF NOT EXISTS suscriptores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100),
  empresa VARCHAR(100),
  idioma VARCHAR(10)
);

INSERT INTO suscriptores (nombre, email, empresa, idioma) VALUES
('Pau', 'paulopeznunez@gmail.com', 'Valencia Comics', 'es');
--('Roberto', 'robertomoramoreno3@gmail.com', 'UK Events', 'en'),
--('Moha', 'mohamed.shahin1703@gmail.com', 'Feria Joven', 'es'),
--('Rúben', 'rubenramirezcatalu@gmail.com', 'Feria Dos Ruedas', 'es'); 
