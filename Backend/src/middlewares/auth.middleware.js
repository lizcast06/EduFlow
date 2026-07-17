const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { errorResponse } = require('../utils/response');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Token de autenticación no proporcionado');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'eduflow_secret_key'
    );

    const usuario = await Usuario.obtenerPorId(decoded.id);

    if (!usuario) {
      return errorResponse(res, 401, 'Usuario no válido o inexistente');
    }

    req.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol_id: usuario.rol_id,
      rol: usuario.rol ? usuario.rol.nombre : null
    };

    next();
  } catch (error) {
    return errorResponse(res, 401, 'Token inválido o expirado');
  }
}

module.exports = authMiddleware;