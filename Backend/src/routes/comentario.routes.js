const express = require('express');
const comentarioController = require('../controllers/comentario.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/actividades/:id/comentarios', authMiddleware, comentarioController.listarComentariosPorActividad);
router.post('/actividades/:id/comentarios', authMiddleware, comentarioController.crearComentario);

module.exports = router;