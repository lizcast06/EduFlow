const { Estado } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

async function listarEstados(req, res) {
  try {
    const estados = await Estado.listarTodos();

    return successResponse(res, 200, 'Estados consultados correctamente', estados);
  } catch (error) {
    return errorResponse(res, 500, 'Error al consultar estados', error.message);
  }
}

module.exports = {
  listarEstados
};