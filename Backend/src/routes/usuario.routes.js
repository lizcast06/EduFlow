const { Router } = require('express');
const { listarEstudiantes } = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// Requires authentication
router.use(authMiddleware);

// Get all students
router.get('/estudiantes', listarEstudiantes);

module.exports = router;
