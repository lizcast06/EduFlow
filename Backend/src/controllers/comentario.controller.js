const { Actividad, Comentario } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const {
  isEmpty,
  isPositiveInteger
} = require('../utils/validators');

async function listarComentariosPorActividad(req, res) {
  try {
    const { id } = req.params;

    if (!isPositiveInteger(id)) {
      return errorResponse(res, 400, 'El id de la actividad no es válido');
    }

    const actividad = await Actividad.findByPk(id);

    if (!actividad) {
      return errorResponse(res, 404, 'Actividad no encontrada');
    }

    const comentarios = await Comentario.listarPorActividad(id);

    return successResponse(res, 200, 'Comentarios consultados correctamente', comentarios);
  } catch (error) {
    return errorResponse(res, 500, 'Error al consultar comentarios', error.message);
  }
}

async function crearComentario(req, res) {
  try {
    const { id } = req.params;
    const { contenido } = req.body;

    if (!isPositiveInteger(id)) {
      return errorResponse(res, 400, 'El id de la actividad no es válido');
    }

    if (isEmpty(contenido)) {
      return errorResponse(res, 400, 'El comentario no puede estar vacío');
    }

    const actividad = await Actividad.findByPk(id);

    if (!actividad) {
      return errorResponse(res, 404, 'Actividad no encontrada');
    }

    const comentario = await Comentario.create({
      actividad_id: id,
      usuario_id: req.usuario.id,
      contenido
    });

    const comentarioDetalle = await Comentario.obtenerPorId(comentario.id);

    return successResponse(res, 201, 'Comentario registrado correctamente', comentarioDetalle);
  } catch (error) {
    return errorResponse(res, 500, 'Error al registrar comentario', error.message);
  }
}

module.exports = {
  listarComentariosPorActividad,
  crearComentario
};