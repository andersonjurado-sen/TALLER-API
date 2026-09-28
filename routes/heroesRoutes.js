// routes/heroesRoutes.js
const express = require('express');
const router = express.Router();
const controlador = require('../controllers/heroesController');
const verificarToken = require('../middleware/verificarToken');
const validarId = require('../middleware/validarId');
const validarHeroe = require('../middleware/validarHeroe');

router.use(verificarToken);

router.get('/', controlador.listar);
router.get('/:id', validarId, controlador.obtenerUno);
router.post('/', validarHeroe, controlador.crear);
router.put('/:id', validarId, validarHeroe, controlador.actualizar);
router.delete('/:id', validarId, controlador.eliminar);

module.exports = router;
