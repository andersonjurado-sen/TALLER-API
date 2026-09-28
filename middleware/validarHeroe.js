// middleware/validarHeroe.js
// Valida el body de heroes Y confirma que la casa productora indicada
// realmente exista. Esto es justo lo que pide el punto 6 del taller:
// que un héroe, al crearse o modificarse, quede asignado a una casa
// productora de las que maneja el punto 3 — no a cualquier número.

const casasProductorasModel = require('../models/casasProductorasModel');

async function validarHeroe(req, res, next) {
  const { nombre, alias, poder_principal, productora_id } = req.body;
  const errores = [];

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    errores.push('nombre es obligatorio y debe ser un texto no vacío');
  } else if (nombre.length > 100) {
    errores.push('nombre no puede superar los 100 caracteres');
  }

  if (alias !== undefined && alias !== null &&
      (typeof alias !== 'string' || alias.length > 100)) {
    errores.push('alias debe ser un texto de máximo 100 caracteres');
  }

  if (poder_principal !== undefined && poder_principal !== null &&
      (typeof poder_principal !== 'string' || poder_principal.length > 150)) {
    errores.push('poder_principal debe ser un texto de máximo 150 caracteres');
  }

  // productora_id es obligatorio a propósito: es la regla del punto 6.
  if (productora_id === undefined || productora_id === null || productora_id === '') {
    errores.push('productora_id es obligatorio: todo héroe debe quedar asignado a una casa productora');
  } else if (!Number.isInteger(Number(productora_id))) {
    errores.push('productora_id debe ser un número entero');
  }

  // Si ya hay errores de formato, ni vale la pena consultar la base todavía
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  // Confirmamos que esa productora exista de verdad, no solo que el
  // número tenga buena forma. Sin esto, la base igual lo rechazaría por
  // la FOREIGN KEY, pero con un error 500 feo en vez de un 400 claro.
  const productora = await casasProductorasModel.obtenerPorId(productora_id);
  if (!productora) {
    return res.status(400).json({
      error: `No existe ninguna casa productora con id ${productora_id}`
    });
  }

  next();
}

module.exports = validarHeroe;
