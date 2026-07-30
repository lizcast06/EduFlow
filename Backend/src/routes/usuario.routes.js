const { Router } = require('express');
const { 
  listarEstudiantes, 
  listarUsuarios, 
  crearUsuario, 
  actualizarUsuario, 
  cambiarEstadoUsuario 
} = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// Requires authentication
router.use(authMiddleware);

// Endpoints for students
router.get('/estudiantes', listarEstudiantes);

// Endpoints for user management (HU-18)
router.get('/', listarUsuarios);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.patch('/:id/estado', cambiarEstadoUsuario);

module.exports = router;
