const express = require('express');
const estadoController = require('../controllers/estado.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, estadoController.listarEstados);

module.exports = router;