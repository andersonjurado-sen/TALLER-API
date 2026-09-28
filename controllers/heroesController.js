// controllers/heroesController.js
// Mismo patrón que casasProductorasController: solo decide qué responder
// y con qué código HTTP, delegando el trabajo de SQL al modelo.

const modelo = require('../models/heroesModel');

// GET /api/heroes
async function listar(req, res) {
  try {
    const heroes = await modelo.obtenerTodas();
    res.json(heroes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar los héroes' });
  }
}

// GET /api/heroes/:id
async function obtenerUno(req, res) {
  try {
    const heroe = await modelo.obtenerPorId(req.params.id);
    if (!heroe) {
      return res.status(404).json({ error: 'Héroe no encontrado' });
    }
    res.json(heroe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar el héroe' });
  }
}

// POST /api/heroes
// Para cuando llega aquí, validarHeroe (middleware) ya confirmó que
// productora_id viene bien formado Y que esa productora existe de verdad.
async function crear(req, res) {
  try {
    const nuevo = await modelo.crear(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el héroe' });
  }
}

// PUT /api/heroes/:id
async function actualizar(req, res) {
  try {
    const existente = await modelo.obtenerPorId(req.params.id);
    if (!existente) {
      return res.status(404).json({ error: 'Héroe no encontrado' });
    }
    const actualizado = await modelo.actualizar(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el héroe' });
  }
}

// DELETE /api/heroes/:id
async function eliminar(req, res) {
  try {
    const seElimino = await modelo.eliminar(req.params.id);
    if (!seElimino) {
      return res.status(404).json({ error: 'Héroe no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el héroe' });
  }
}

module.exports = { listar, obtenerUno, crear, actualizar, eliminar };
