// routes/authRoutes.js
// Estas rutas NO llevan verificarToken porque son las que le dan el token
// a alguien que todavía no lo tiene — pedirle un token para loguearse
// sería una contradicción.

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/registro', authController.registrar);
router.post('/login', authController.login);

module.exports = router;
