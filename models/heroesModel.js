// models/heroesModel.js
// Igual patrón que casasProductorasModel: la única capa que toca SQL
// para la tabla heroes. Los SELECT incluyen un JOIN para traer también
// el nombre de la casa productora, no solo su id.

const pool = require('../config/db');

async function obtenerTodas() {
  const [filas] = await pool.query(
    `SELECT h.*, c.nombre AS productora_nombre
     FROM heroes h
     LEFT JOIN casas_productoras_heroes c ON h.productora_id = c.id`
  );
  return filas;
}

async function obtenerPorId(id) {
  const [filas] = await pool.query(
    `SELECT h.*, c.nombre AS productora_nombre
     FROM heroes h
     LEFT JOIN casas_productoras_heroes c ON h.productora_id = c.id
     WHERE h.id = ?`,
    [id]
  );
  return filas[0];
}

async function crear({ nombre, alias, poder_principal, productora_id }) {
  const [resultado] = await pool.query(
    `INSERT INTO heroes (nombre, alias, poder_principal, productora_id)
     VALUES (?, ?, ?, ?)`,
    [nombre, alias, poder_principal, productora_id]
  );
  return obtenerPorId(resultado.insertId);
}

async function actualizar(id, { nombre, alias, poder_principal, productora_id }) {
  await pool.query(
    `UPDATE heroes
     SET nombre = ?, alias = ?, poder_principal = ?, productora_id = ?
     WHERE id = ?`,
    [nombre, alias, poder_principal, productora_id, id]
  );
  return obtenerPorId(id);
}

async function eliminar(id) {
  const [resultado] = await pool.query('DELETE FROM heroes WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = { obtenerTodas, obtenerPorId, crear, actualizar, eliminar };
