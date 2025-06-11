const express = require('express');
const router = express.Router();

// GET /api/alojamientos
router.get('/', /* controlador para listar alojamientos */);

// POST /api/alojamientos
router.post('/', /* controlador para agregar alojamiento */);

// PUT /api/alojamientos/:id
router.put('/:id', /* controlador para actualizar alojamiento */);

// DELETE /api/alojamientos/:id
router.delete('/:id', /* controlador para eliminar alojamiento */);

module.exports = router;