// config/db.js
// Este módulo NO abre una conexión suelta: crea un "pool" (una piscina de
// conexiones reutilizables). Cada vez que un controlador necesite hablar
// con MySQL, toma una conexión prestada del pool, la usa y la devuelve.
// Esto es más eficiente que abrir/cerrar una conexión por cada petición.

const mysql = require('mysql2/promise'); // usamos la versión con promesas para poder usar async/await
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // si no hay conexiones libres, espera en vez de fallar
  connectionLimit: 10,      // máximo de conexiones simultáneas en el pool
  queueLimit: 0             // sin límite de peticiones en espera
});

module.exports = pool;
