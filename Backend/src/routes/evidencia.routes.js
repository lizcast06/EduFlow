const express = require('express');
const evidenciaController = require('../controllers/evidencia.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/actividades/:id/evidencias', authMiddleware, evidenciaController.listarEvidenciasPorActividad);
router.post('/actividades/:id/evidencias', authMiddleware, evidenciaController.crearEvidencia);

module.exports = router;