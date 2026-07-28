const { Router } = require('express');
const { listarPorActividad } = require('../controllers/historial.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.use(authMiddleware);

// Rutas base: /api/actividades/:id_actividad/historial
router.get('/actividades/:id_actividad/historial', listarPorActividad);

module.exports = router;
