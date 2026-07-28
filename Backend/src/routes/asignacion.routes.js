const express = require('express');
const asignacionController = require('../controllers/asignacion.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/actividades/:id/asignaciones', authMiddleware, asignacionController.asignarResponsables);
router.get('/actividades/:id/asignaciones', authMiddleware, asignacionController.listarResponsables);

module.exports = router;