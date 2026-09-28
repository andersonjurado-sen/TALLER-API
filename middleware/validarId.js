// middleware/validarId.js
// Reutilizable para cualquier ruta que reciba un :id en la URL.
// Valida el FORMATO del id (que sea un número entero positivo) — no
// confirma que exista en la base, eso lo sigue haciendo el controlador.

function validarId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'El id debe ser un número entero positivo' });
  }
  next();
}

module.exports = validarId;
