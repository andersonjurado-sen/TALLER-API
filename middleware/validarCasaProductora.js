// middleware/validarCasaProductora.js
// Revisa el body ANTES de que el controlador toque la base de datos.
// Si algo está mal, corta aquí mismo con 400 y el controlador ni se llama.

function validarCasaProductora(req, res, next) {
  const { nombre, pais, tipo_medio, heroes_famosos } = req.body;
  const errores = [];

  // nombre es NOT NULL en la tabla, así que es el único campo realmente obligatorio
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    errores.push('nombre es obligatorio y debe ser un texto no vacío');
  } else if (nombre.length > 100) {
    errores.push('nombre no puede superar los 100 caracteres (así está definida la columna)');
  }

  // Los demás son opcionales, pero SI vienen, deben ser texto y respetar el tamaño de columna
  if (pais !== undefined && (typeof pais !== 'string' || pais.length > 100)) {
    errores.push('pais debe ser un texto de máximo 100 caracteres');
  }

  if (tipo_medio !== undefined && (typeof tipo_medio !== 'string' || tipo_medio.length > 100)) {
    errores.push('tipo_medio debe ser un texto de máximo 100 caracteres');
  }

  if (heroes_famosos !== undefined && typeof heroes_famosos !== 'string') {
    errores.push('heroes_famosos debe ser un texto');
  }

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  next(); // todo válido, sigue al controlador
}

module.exports = validarCasaProductora;
