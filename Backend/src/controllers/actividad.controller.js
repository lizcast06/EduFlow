const { Actividad, Estado, Asignacion, Evidencia, Historial } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const {
  isEmpty,
  isValidPriority,
  isPositiveInteger
} = require('../utils/validators');

async function listarActividades(req, res) {
  try {
    const actividades = await Actividad.listarConRelaciones();

    return successResponse(res, 200, 'Actividades consultadas correctamente', actividades);
  } catch (error) {
    return errorResponse(res, 500, 'Error al consultar actividades', error.message);
  }
}

async function obtenerActividad(req, res) {
  try {
    const { id } = req.params;

    if (!isPositiveInteger(id)) {
      return errorResponse(res, 400, 'El id de la actividad no es válido');
    }

    const actividad = await Actividad.obtenerDetalle(id);

    if (!actividad) {
      return errorResponse(res, 404, 'Actividad no encontrada');
    }

    return successResponse(res, 200, 'Actividad consultada correctamente', actividad);
  } catch (error) {
    return errorResponse(res, 500, 'Error al consultar la actividad', error.message);
  }
}

async function crearActividad(req, res) {
  try {
    const {
      titulo,
      descripcion,
      fecha_limite,
      prioridad,
      estado_id,
      asignados // array of user IDs
    } = req.body;

    if (isEmpty(titulo) || isEmpty(fecha_limite) || isEmpty(prioridad)) {
      return errorResponse(res, 400, 'Título, fecha límite y prioridad son obligatorios');
    }

    if (!isValidPriority(prioridad)) {
      return errorResponse(res, 400, 'La prioridad debe ser Alta, Media o Baja');
    }

    let estadoIdFinal = estado_id;

    if (!estadoIdFinal) {
      const estadoInicial = await Estado.obtenerPorNombre('Backlog');
      estadoIdFinal = estadoInicial ? estadoInicial.id : null;
    }

    if (!estadoIdFinal || !isPositiveInteger(estadoIdFinal)) {
      return errorResponse(res, 400, 'El estado_id no es válido');
    }

    const estado = await Estado.obtenerPorId(estadoIdFinal);

    if (!estado) {
      return errorResponse(res, 400, 'El estado indicado no existe');
    }

    const nuevaActividad = await Actividad.create({
      titulo,
      descripcion: descripcion || null,
      fecha_limite,
      prioridad,
      estado_id: estadoIdFinal,
      creador_id: req.usuario.id
    });

    if (asignados && Array.isArray(asignados) && asignados.length > 0) {
      const asignaciones = asignados.map(usuario_id => ({
        actividad_id: nuevaActividad.id,
        usuario_id
      }));
      await Asignacion.bulkCreate(asignaciones);
    }

    await Historial.create({
      actividad_id: nuevaActividad.id,
      usuario_id: req.usuario.id,
      accion: 'Actividad creada',
      detalles: `El usuario creó la actividad en estado ${estadoInicial.nombre} con prioridad ${prioridad}`
    });

    const actividadDetalle = await Actividad.obtenerDetalle(nuevaActividad.id);

    return successResponse(res, 201, 'Actividad creada correctamente', actividadDetalle);
  } catch (error) {
    return errorResponse(res, 500, 'Error al crear actividad', error.message);
  }
}

async function actualizarActividad(req, res) {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      fecha_limite,
      prioridad,
      estado_id
    } = req.body;

    if (!isPositiveInteger(id)) {
      return errorResponse(res, 400, 'El id de la actividad no es válido');
    }

    const actividad = await Actividad.findByPk(id);

    if (!actividad) {
      return errorResponse(res, 404, 'Actividad no encontrada');
    }

    if (prioridad && !isValidPriority(prioridad)) {
      return errorResponse(res, 400, 'La prioridad debe ser Alta, Media o Baja');
    }

    if (estado_id) {
      if (!isPositiveInteger(estado_id)) {
        return errorResponse(res, 400, 'El estado_id no es válido');
      }

      const estado = await Estado.obtenerPorId(estado_id);

      if (!estado) {
        return errorResponse(res, 400, 'El estado indicado no existe');
      }
    }

    await actividad.update({
      titulo: titulo || actividad.titulo,
      descripcion: descripcion !== undefined ? descripcion : actividad.descripcion,
      fecha_limite: fecha_limite || actividad.fecha_limite,
      prioridad: prioridad || actividad.prioridad,
      estado_id: estado_id || actividad.estado_id
    });

    const actividadDetalle = await Actividad.obtenerDetalle(id);

    return successResponse(res, 200, 'Actividad actualizada correctamente', actividadDetalle);
  } catch (error) {
    return errorResponse(res, 500, 'Error al actualizar actividad', error.message);
  }
}

async function eliminarActividad(req, res) {
  try {
    const { id } = req.params;

    if (!isPositiveInteger(id)) {
      return errorResponse(res, 400, 'El id de la actividad no es válido');
    }

    const actividad = await Actividad.findByPk(id);

    if (!actividad) {
      return errorResponse(res, 404, 'Actividad no encontrada');
    }

    await actividad.destroy();

    return successResponse(res, 200, 'Actividad eliminada correctamente');
  } catch (error) {
    return errorResponse(res, 500, 'Error al eliminar actividad', error.message);
  }
}

async function cambiarEstado(req, res) {
  try {
    const { id } = req.params;
    const { estado_id, estado } = req.body;

    if (!isPositiveInteger(id)) {
      return errorResponse(res, 400, 'El id de la actividad no es válido');
    }

    const actividad = await Actividad.findByPk(id);

    if (!actividad) {
      return errorResponse(res, 404, 'Actividad no encontrada');
    }

    let estadoEncontrado = null;

    if (estado_id) {
      if (!isPositiveInteger(estado_id)) {
        return errorResponse(res, 400, 'El estado_id no es válido');
      }

      estadoEncontrado = await Estado.obtenerPorId(estado_id);
    } else if (estado) {
      estadoEncontrado = await Estado.obtenerPorNombre(estado);
    } else {
      return errorResponse(res, 400, 'Debe enviar estado_id o estado');
    }

    if (!estadoEncontrado) {
      return errorResponse(res, 400, 'El estado indicado no existe');
    }

    if (estadoEncontrado.nombre === 'Completado') {
      const evidencias = await Evidencia.findAll({ where: { actividad_id: id } });
      if (evidencias.length === 0) {
        return errorResponse(res, 400, 'No se puede mover a Completado sin adjuntar una evidencia');
      }
    }

    const actividadActualizada = await Actividad.cambiarEstado(id, estadoEncontrado.id);

    await Historial.create({
      actividad_id: id,
      usuario_id: req.usuario ? req.usuario.id : null,
      accion: 'Cambio de estado',
      detalles: `La actividad pasó a estado: ${estadoEncontrado.nombre}`
    });

    return successResponse(res, 200, 'Estado de actividad actualizado correctamente', actividadActualizada);
  } catch (error) {
    return errorResponse(res, 500, 'Error al cambiar estado de actividad', error.message);
  }
}

module.exports = {
  listarActividades,
  obtenerActividad,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
  cambiarEstado
};