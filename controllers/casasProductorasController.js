// controllers/casasProductorasController.js
// Cada función de aquí es un "handler" de Express: recibe (req, res) y
// responde. No habla SQL directamente — todo el trabajo con la base de
// datos se lo delega al modelo (Paso 2). Este archivo solo decide QUÉ
// responder y con qué código HTTP.

const modelo = require('../models/casasProductorasModel');

// GET /api/casas-productoras
// Consultar TODAS las casas productoras
async function listar(req, res) {
  try {
    const casas = await modelo.obtenerTodas();
    res.json(casas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar las casas productoras' });
  }
}

// GET /api/casas-productoras/:id
// Consultar UNA sola casa productora por id
async function obtenerUna(req, res) {
  try {
    const casa = await modelo.obtenerPorId(req.params.id);
    if (!casa) {
      // 404: el id es válido como número, pero no existe ninguna fila con ese id
      return res.status(404).json({ error: 'Casa productora no encontrada' });
    }
    res.json(casa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar la casa productora' });
  }
}

// GET /api/casas-productoras/buscar?texto=algo
// Consultar por un texto específico (nombre, país, tipo de medio o héroes)
async function buscar(req, res) {
  try {
    const { texto } = req.query;
    if (!texto) {
      // 400: la petición está mal formada, falta el parámetro obligatorio
      return res.status(400).json({ error: 'Falta el parámetro de búsqueda "texto"' });
    }
    const resultados = await modelo.buscarPorTexto(texto);
    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar casas productoras' });
  }
}

// POST /api/casas-productoras
// Insertar una casa productora nueva
async function crear(req, res) {
  try {
    const nueva = await modelo.crear(req.body);
    // 201 Created: se creó un recurso nuevo, y lo devolvemos ya con su id
    res.status(201).json(nueva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la casa productora' });
  }
}

// PUT /api/casas-productoras/:id
// Modificar una casa productora existente
async function actualizar(req, res) {
  try {
    // Verificamos que exista ANTES de actualizar, para poder devolver
    // un 404 claro si el id no corresponde a nada (en vez de un "éxito"
    // que en realidad no cambió ninguna fila).
    const existente = await modelo.obtenerPorId(req.params.id);
    if (!existente) {
      return res.status(404).json({ error: 'Casa productora no encontrada' });
    }
    const actualizada = await modelo.actualizar(req.params.id, req.body);
    res.json(actualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la casa productora' });
  }
}

// DELETE /api/casas-productoras/:id
// Eliminar una casa productora
async function eliminar(req, res) {
  try {
    const seElimino = await modelo.eliminar(req.params.id);
    if (!seElimino) {
      return res.status(404).json({ error: 'Casa productora no encontrada' });
    }
    // 204 No Content: se borró bien, no hay nada que devolver en el body
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la casa productora' });
  }
}

module.exports = {
  listar,
  obtenerUna,
  buscar,
  crear,
  actualizar,
  eliminar
};
