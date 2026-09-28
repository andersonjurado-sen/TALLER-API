// controllers/authController.js
// Maneja el registro de usuarios y el login. El login es lo que entrega
// el "pase" (token JWT) que después hay que presentar para usar las
// rutas protegidas de casas_productoras_heroes.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuariosModel = require('../models/usuariosModel');

// POST /api/auth/registro
async function registrar(req, res) {
  try {
    const { nombre_usuario, password } = req.body;
    if (!nombre_usuario || !password) {
      return res.status(400).json({ error: 'nombre_usuario y password son obligatorios' });
    }

    const existente = await usuariosModel.buscarPorNombreUsuario(nombre_usuario);
    if (existente) {
      // 409 Conflict: el recurso (ese nombre de usuario) ya existe
      return res.status(409).json({ error: 'Ese nombre de usuario ya existe' });
    }

    // bcrypt.hash "revuelve" la contraseña de forma que no se puede
    // revertir. El "10" es el costo del algoritmo: más alto = más lento
    // pero más seguro. 10 es un punto medio razonable.
    const password_hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = await usuariosModel.crear(nombre_usuario, password_hash);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { nombre_usuario, password } = req.body;
    if (!nombre_usuario || !password) {
      return res.status(400).json({ error: 'nombre_usuario y password son obligatorios' });
    }

    const usuario = await usuariosModel.buscarPorNombreUsuario(nombre_usuario);
    if (!usuario) {
      // No decimos "el usuario no existe" para no darle pistas a quien
      // intenta adivinar cuentas válidas — el mensaje es igual en ambos casos.
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // bcrypt.compare vuelve a "revolver" la contraseña recibida y compara
    // el resultado con el hash guardado, sin nunca desencriptar el hash.
    const coincide = await bcrypt.compare(password, usuario.password_hash);
    if (!coincide) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // jwt.sign firma un "pase" que incluye el id y usuario, usando
    // JWT_SECRET como la clave que solo tu servidor conoce. Expira en 2
    // horas: pasado ese tiempo, el usuario tiene que loguearse de nuevo.
    const token = jwt.sign(
      { id: usuario.id, nombre_usuario: usuario.nombre_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

module.exports = { registrar, login };
