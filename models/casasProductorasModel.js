// models/casasProductorasModel.js
// Esta capa es la única que sabe "hablar SQL" sobre la tabla
// casas_productoras_heroes. El controlador (Paso 3) va a llamar estas
// funciones en vez de escribir queries directamente ahí — así, si un día
// cambia la estructura de la tabla, solo se toca este archivo.

const pool = require('../config/db');

// Trae todas las casas productoras
async function obtenerTodas() {
  const [filas] = await pool.query('SELECT * FROM casas_productoras_heroes');
  return filas;
}

// Trae una sola casa productora por su id.
// Devuelve undefined si no existe ninguna con ese id (el controlador
// decide qué hacer con eso, ej. responder 404).
async function obtenerPorId(id) {
  const [filas] = await pool.query(
    'SELECT * FROM casas_productoras_heroes WHERE id = ?',
    [id]
  );
  return filas[0];
}

// Busca casas productoras cuyo nombre, país, tipo de medio o héroes
// famosos contengan un texto específico (esto alimenta el punto 3
// del taller: "Consultar casas productoras por un texto en específico").
async function buscarPorTexto(texto) {
  const comodin = `%${texto}%`;
  const [filas] = await pool.query(
    `SELECT * FROM casas_productoras_heroes
     WHERE nombre LIKE ? OR pais LIKE ? OR tipo_medio LIKE ? OR heroes_famosos LIKE ?`,
    [comodin, comodin, comodin, comodin]
  );
  return filas;
}

// Inserta una casa productora nueva y devuelve la fila ya creada completa
async function crear({ nombre, pais, tipo_medio, heroes_famosos }) {
  const [resultado] = await pool.query(
    `INSERT INTO casas_productoras_heroes (nombre, pais, tipo_medio, heroes_famosos)
     VALUES (?, ?, ?, ?)`,
    [nombre, pais, tipo_medio, heroes_famosos]
  );
  // resultado.insertId es el id que MySQL le asignó automáticamente
  // (por el AUTO_INCREMENT). Lo usamos para devolver la fila completa.
  return obtenerPorId(resultado.insertId);
}

// Actualiza una casa productora existente por id
async function actualizar(id, { nombre, pais, tipo_medio, heroes_famosos }) {
  await pool.query(
    `UPDATE casas_productoras_heroes
     SET nombre = ?, pais = ?, tipo_medio = ?, heroes_famosos = ?
     WHERE id = ?`,
    [nombre, pais, tipo_medio, heroes_famosos, id]
  );
  return obtenerPorId(id);
}

// Elimina una casa productora por id.
// affectedRows dice cuántas filas cambiaron: si es 0, ese id no existía.
async function eliminar(id) {
  const [resultado] = await pool.query(
    'DELETE FROM casas_productoras_heroes WHERE id = ?',
    [id]
  );
  return resultado.affectedRows > 0;
}

module.exports = {
  obtenerTodas,
  obtenerPorId,
  buscarPorTexto,
  crear,
  actualizar,
  eliminar
};
