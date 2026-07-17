const { Actividad, Evidencia } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const {
  isEmpty,
  isValidUrl,
  isPositiveInteger
} = require('../utils/validators');

async function listarEvidenciasPorActividad(req, res) {
  try {
    const { id } = req.params;

    if (!isPositiveInteger(id)) {
      return errorResponse(res, 400, 'El id de la actividad no es válido');
    }

    const actividad = await Actividad.findByPk(id);

    if (!actividad) {
      return errorResponse(res, 404, 'Actividad no encontrada');
    }

    const evidencias = await Evidencia.listarPorActividad(id);

    return successResponse(res, 200, 'Evidencias consultadas correctamente', evidencias);
  } catch (error) {
    return errorResponse(res, 500, 'Error al consultar evidencias', error.message);
  }
}

async function crearEvidencia(req, res) {
  try {
    const { id } = req.params;
    const { archivo_url } = req.body;

    if (!isPositiveInteger(id)) {
      return errorResponse(res, 400, 'El id de la actividad no es válido');
    }

    if (isEmpty(archivo_url)) {
      return errorResponse(res, 400, 'La URL de evidencia es obligatoria');
    }

    if (!isValidUrl(archivo_url)) {
      return errorResponse(res, 400, 'La evidencia debe ser una URL válida con http o https');
    }

    const actividad = await Actividad.findByPk(id);

    if (!actividad) {
      return errorResponse(res, 404, 'Actividad no encontrada');
    }

    const evidencia = await Evidencia.create({
      actividad_id: id,
      usuario_id: req.usuario.id,
      archivo_url
    });

    const evidenciaDetalle = await Evidencia.obtenerPorId(evidencia.id);

    return successResponse(res, 201, 'Evidencia registrada correctamente', evidenciaDetalle);
  } catch (error) {
    return errorResponse(res, 500, 'Error al registrar evidencia', error.message);
  }
}

module.exports = {
  listarEvidenciasPorActividad,
  crearEvidencia
};