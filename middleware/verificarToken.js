// middleware/verificarToken.js
// Un middleware es una función que se ejecuta ANTES del controlador.
// Esta revisa que venga un token válido en la petición; si no, corta el
// paso ahí mismo y el controlador nunca se llega a ejecutar.

const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  // El token se espera en el header: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Falta el token de autenticación' });
  }

  const token = authHeader.split(' ')[1]; // separa "Bearer" del token en sí

  try {
    // jwt.verify revisa la firma con JWT_SECRET. Si el token fue alterado,
    // o si el secreto no coincide, o si ya expiró, esto lanza un error.
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // dejamos disponible quién hizo la petición
    next(); // todo bien, deja pasar a la siguiente función (el controlador)
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = verificarToken;
