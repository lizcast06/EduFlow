const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {
  crearGrupo,
  listarGrupos,
  unirseAGrupo
} = require('../controllers/grupo.controller');

router.use(authMiddleware);

router.get('/', listarGrupos);
router.post('/', crearGrupo);
router.post('/unirse', unirseAGrupo);

module.exports = router;
