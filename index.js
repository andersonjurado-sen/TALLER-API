// index.js
// Punto de entrada de la aplicación. Aquí se levanta el servidor Express
// y (más adelante) se conectan las rutas de casas_productoras_heroes y heroes.

const express = require('express');
require('dotenv').config();
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const casasProductorasRoutes = require('./routes/casasProductorasRoutes');
const heroesRoutes = require('./routes/heroesRoutes');

const app = express();

// express.json() le dice a Express que interprete el body de las peticiones
// como JSON y lo deje disponible en req.body. Sin esto, req.body llegaría vacío.
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/casas-productoras', casasProductorasRoutes);
app.use('/api/heroes', heroesRoutes);

// Endpoint de prueba: si esto responde bien, significa que el servidor
// arrancó Y que la conexión con MySQL funciona. Es el primer checkpoint.
app.get('/api/ping-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
    res.json({ ok: true, resultado: rows[0].resultado });
  } catch (error) {
    // Imprimimos el objeto de error COMPLETO en la terminal (no solo
    // error.message, que a veces viene vacío si es un AggregateError).
    // Ahí es donde vas a ver la causa real.
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).json({
      ok: false,
      error: error.message,
      code: error.code || null,       // ej: ENOTFOUND, ECONNREFUSED, ER_ACCESS_DENIED_ERROR
      errors: error.errors || null     // si es AggregateError, aquí están los errores reales
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
