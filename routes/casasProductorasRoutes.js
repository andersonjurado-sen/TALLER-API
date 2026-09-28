// routes/casasProductorasRoutes.js
// router.use(verificarToken) aplica el middleware a TODAS las rutas
// definidas después de esa línea en este archivo — así implementamos el
// punto 4 del taller ("solamente para usuarios autenticados") sin tener
// que repetir el middleware en cada línea.

const express = require('express');
const router = express.Router();
const controlador = require('../controllers/casasProductorasController');
const verificarToken = require('../middleware/verificarToken');
const validarCasaProductora = require('../middleware/validarCasaProductora');
const validarId = require('../middleware/validarId');

router.use(verificarToken);

// IMPORTANTE: /buscar va ANTES que /:id. Express revisa las rutas en
// orden, y si /:id estuviera primero, una petición a /buscar entraría
// ahí pensando que "buscar" es un id, y nunca llegaría a la función buscar.
router.get('/buscar', controlador.buscar);

router.get('/', controlador.listar);
router.get('/:id', validarId, controlador.obtenerUna);
router.post('/', validarCasaProductora, controlador.crear);
router.put('/:id', validarId, validarCasaProductora, controlador.actualizar);
router.delete('/:id', validarId, controlador.eliminar);

module.exports = router;
