const { Op } = require('sequelize');
const { Actividad, Usuario, Asignacion } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { isPositiveInteger } = require('../utils/validators');

function normalizarUsuarioIds(body) {
  if (Array.isArray(body.usuario_ids)) {
    return [...new Set(body.usuario_ids.map(Number))];
  }

  if (Array.isArray(body.usuarios)) {
    return [...new Set(body.usuarios.map(Number))];
  }

  if (body.usuario_id) {
    return [Number(body.usuario_id)];
  }

  return [];
}

function formatearResponsables(asignaciones) {
  return asignaciones.map((asignacion) => asignacion.usuario);
}

async function asignarResponsables(req, res) {
  try {
    const { id } = req.params;

    if (!isPositiveInteger(id)) {
      return errorResponse(res, 400, 'El id de la actividad no es válido');
    }

    const actividad = await Actividad.findByPk(id);

    if (!actividad) {
      return errorResponse(res, 404, 'Actividad no encontrada');
    }

    const usuarioIds = normalizarUsuarioIds(req.body);

    const idsInvalidos = usuarioIds.filter((usuarioId) => !isPositiveInteger(usuarioId));

    if (idsInvalidos.length > 0) {
      return errorResponse(res, 400, 'Todos los usuario_ids deben ser números enteros positivos', {
        idsInvalidos
      });
    }

    if (usuarioIds.length === 0) {
      await Asignacion.destroy({
        where: {
          actividad_id: id
        }
      });

      return successResponse(res, 200, 'La actividad quedó sin responsables asignados', {
        actividad_id: Number(id),
        estadoAsignacion: 'Sin asignar',
        responsables: []
      });
    }

    const usuariosActivos = await Usuario.obtenerActivosPorIds(usuarioIds);
    const idsEncontrados = usuariosActivos.map((usuario) => usuario.id);

    const idsNoValidos = usuarioIds.filter((usuarioId) => !idsEncontrados.includes(usuarioId));

    if (idsNoValidos.length > 0) {
      return errorResponse(res, 400, 'Uno o más usuarios no existen o no están activos', {
        usuarios_no_validos: idsNoValidos
      });
    }

    const usuariosNoEstudiantes = usuariosActivos.filter(
      (usuario) => !usuario.rol || usuario.rol.nombre !== 'Estudiante'
    );

    if (usuariosNoEstudiantes.length > 0) {
      return errorResponse(res, 400, 'Solo se pueden asignar usuarios con rol Estudiante', {
        usuarios_no_estudiantes: usuariosNoEstudiantes.map((usuario) => ({
          id: usuario.id,
          nombre: usuario.nombre,
          rol: usuario.rol ? usuario.rol.nombre : null
        }))
      });
    }

    await Asignacion.destroy({
      where: {
        actividad_id: id,
        usuario_id: {
          [Op.notIn]: usuarioIds
        }
      }
    });

    for (const usuarioId of usuarioIds) {
      await Asignacion.findOrCreate({
        where: {
          actividad_id: id,
          usuario_id: usuarioId
        },
        defaults: {
          actividad_id: id,
          usuario_id: usuarioId
        }
      });
    }

    const asignaciones = await Asignacion.listarPorActividad(id);
    const responsables = formatearResponsables(asignaciones);

    return successResponse(res, 200, 'Responsables asignados correctamente', {
      actividad_id: Number(id),
      estadoAsignacion: responsables.length > 0 ? 'Asignada' : 'Sin asignar',
      totalResponsables: responsables.length,
      responsables
    });
  } catch (error) {
    return errorResponse(res, 500, 'Error al asignar responsables', error.message);
  }
}

async function listarResponsables(req, res) {
  try {
    const { id } = req.params;

    if (!isPositiveInteger(id)) {
      return errorResponse(res, 400, 'El id de la actividad no es válido');
    }

    const actividad = await Actividad.findByPk(id);

    if (!actividad) {
      return errorResponse(res, 404, 'Actividad no encontrada');
    }

    const asignaciones = await Asignacion.listarPorActividad(id);
    const responsables = formatearResponsables(asignaciones);

    return successResponse(res, 200, 'Responsables consultados correctamente', {
      actividad_id: Number(id),
      estadoAsignacion: responsables.length > 0 ? 'Asignada' : 'Sin asignar',
      totalResponsables: responsables.length,
      responsables
    });
  } catch (error) {
    return errorResponse(res, 500, 'Error al consultar responsables', error.message);
  }
}

module.exports = {
  asignarResponsables,
  listarResponsables
};