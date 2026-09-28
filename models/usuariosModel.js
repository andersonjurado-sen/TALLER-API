// models/usuariosModel.js
// Igual que el modelo de casas productoras: la única capa que toca SQL
// para la tabla usuarios.

const pool = require('../config/db');

async function buscarPorNombreUsuario(nombre_usuario) {
  const [filas] = await pool.query(
    'SELECT * FROM usuarios WHERE nombre_usuario = ?',
    [nombre_usuario]
  );
  return filas[0]; // undefined si no existe
}

async function crear(nombre_usuario, password_hash) {
  const [resultado] = await pool.query(
    'INSERT INTO usuarios (nombre_usuario, password_hash) VALUES (?, ?)',
    [nombre_usuario, password_hash]
  );
  return { id: resultado.insertId, nombre_usuario };
}

module.exports = { buscarPorNombreUsuario, crear };
