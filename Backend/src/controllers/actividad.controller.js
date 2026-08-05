const { Actividad, Estado, Asignacion, Evidencia, Historial, Comentario } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const {
  isEmpty,
  isValidPriority,
  isPositiveInteger
} = require('../utils/validators');

async function listarActividades(req, res) {
  try {
    const filtros = {
      estado: req.query.estado || req.query.estatus,
      prioridad: req.query.prioridad,
      responsable: req.query.responsable
    };

    const actividades = await Actividad.listarConRelaciones(
      req.usuario,
      filtros
    );

    return successResponse(
      res,
      200,
      'Actividades consultadas correctamente',
      actividades
    );
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
      return errorResponse(
        res,
        400,
        'La prioridad debe ser Baja, Media, Alta o Urgente'
      );
    }

    let estadoInicial = null;
    let estadoIdFinal = estado_id;

    if (!estadoIdFinal) {
      estadoInicial = await Estado.obtenerPorNombre('Pendiente');
      estadoIdFinal = estadoInicial ? estadoInicial.id : null;
    } else {
      estadoInicial = await Estado.obtenerPorId(estadoIdFinal);
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
      return errorResponse(
        res,
        400,
        'La prioridad debe ser Baja, Media, Alta o Urgente'
      );
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
    const { estado_id, estado, comentario } = req.body;

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

    // RN-19: Si una actividad Completada se reabre,
    // debe existir un comentario de justificación.

    const estadoActual = await Estado.obtenerPorId(actividad.estado_id);

    const esReapertura =
      estadoActual &&
      estadoActual.nombre === 'Completado' &&
      estadoEncontrado.nombre !== 'Completado';

    if (esReapertura) {
      if (!comentario || comentario.trim() === '') {
        return errorResponse(
          res,
          400,
          'Debe proporcionar un comentario para reabrir una actividad completada'
        );
      }

      await Comentario.create({
        actividad_id: actividad.id,
        usuario_id: req.usuario.id,
        contenido: comentario.trim()
      });
    }

    if (estadoEncontrado.nombre === 'Completado') {
      if (req.usuario.rol !== 'Docente' && req.usuario.rol !== 'Administrador') {
        return errorResponse(res, 403, 'Solo un Docente puede aprobar y mover la actividad a Completado.');
      }

      const evidencias = await Evidencia.findAll({ where: { actividad_id: id } });
      if (evidencias.length === 0) {
        return errorResponse(res, 400, 'No se puede mover a Completado sin adjuntar una evidencia');
      }
    }

    const actividadActualizada = await Actividad.cambiarEstado(id, estadoEncontrado.id);

    await Historial.create({
      actividad_id: id,
      usuario_id: req.usuario.id,
      accion: 'Cambio de estado',
      detalles: `Estado cambiado de ${estadoActual.nombre} a ${estadoEncontrado.nombre}`
    });

    return successResponse(res, 200, 'Estado de actividad actualizado correctamente', actividadActualizada);
  } catch (error) {
    return errorResponse(res, 500, 'Error al cambiar estado de actividad', error.message);
  }
}

async function calificarActividad(req, res) {
  try {
    const { id, estudiante_id } = req.params;
    const { calificacion, retroalimentacion } = req.body;

    if (req.usuario.rol !== 'Docente' && req.usuario.rol !== 'Administrador') {
      return errorResponse(res, 403, 'No tienes permisos para calificar actividades');
    }

    const asignacion = await Asignacion.findOne({
      where: { actividad_id: id, usuario_id: estudiante_id }
    });

    if (!asignacion) {
      return errorResponse(res, 404, 'No se encontró la asignación de este estudiante para esta actividad');
    }

    asignacion.calificacion = calificacion !== undefined ? calificacion : asignacion.calificacion;
    asignacion.retroalimentacion = retroalimentacion !== undefined ? retroalimentacion : asignacion.retroalimentacion;
    
    await asignacion.save();

    await Historial.create({
      actividad_id: id,
      usuario_id: req.usuario.id,
      accion: 'Actividad calificada',
      detalles: `Se calificó la actividad al estudiante ${estudiante_id} con nota ${calificacion}`
    });

    return successResponse(res, 200, 'Calificación guardada correctamente', asignacion);
  } catch (error) {
    return errorResponse(res, 500, 'Error al calificar actividad', error.message);
  }
}

module.exports = {
  listarActividades,
  obtenerActividad,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
  cambiarEstado,
  calificarActividad
};