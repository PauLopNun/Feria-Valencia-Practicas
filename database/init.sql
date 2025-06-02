CREATE TABLE IF NOT EXISTS suscriptores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100),
  empresa VARCHAR(100),
  idioma VARCHAR(10),
  tiempo_respuesta DATE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS suscriptores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100),
  empresa VARCHAR(100),
  idioma VARCHAR(10),
  tiempo_respuesta DATE DEFAULT NULL
);

/*
INSERT INTO suscriptores (nombre, email, empresa, idioma, tiempo_respuesta) VALUES
  ('Pau', 'paulopeznunez@gmail.com', 'Valencia Comics', 'es', '2025-11-15');

-- INSERT INTO suscriptores (nombre, email, empresa, idioma, tiempo_respuesta) VALUES
--   ('Elena', 'elenalablan@gmail.com', 'Feria Joven', 'es', '2025-11-15'),
--   ('Roberto', 'robertomoramoreno3@gmail.com', 'UK Events', 'en', '2025-11-15'),
--   ('Moha', 'mohamed.shahin1703@gmail.com', 'Feria Joven', 'es', '2025-11-15'),
--   ('Ruben', 'rubenramirezcatalu@gmail.com', 'Feria Dos Ruedas', 'es', '2025-11-15'); */