const express = require('express');
const actividadController = require('../controllers/actividad.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, actividadController.listarActividades);
router.get('/:id', authMiddleware, actividadController.obtenerActividad);
router.post('/', authMiddleware, actividadController.crearActividad);
router.put('/:id', authMiddleware, actividadController.actualizarActividad);
router.delete('/:id', authMiddleware, actividadController.eliminarActividad);
router.put('/:id/estado', authMiddleware, actividadController.cambiarEstado);
router.put('/:id/calificar/:estudiante_id', authMiddleware, actividadController.calificarActividad);

module.exports = router;