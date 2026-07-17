const { errorResponse } = require('../utils/response');

function notFoundHandler(req, res) {
  return errorResponse(res, 404, 'Ruta no encontrada');
}

function errorHandler(error, req, res, next) {
  console.error(error);

  return errorResponse(
    res,
    error.statusCode || 500,
    error.message || 'Error interno del servidor'
  );
}

module.exports = {
  notFoundHandler,
  errorHandler
};