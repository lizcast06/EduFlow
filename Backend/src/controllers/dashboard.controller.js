const { Sequelize } = require('sequelize');
const { Actividad, Estado } = require('../models');
const { Op } = require('sequelize');
const { successResponse, errorResponse } = require('../utils/response');

async function obtenerAvance(req, res) {
  try {
    const usuario = req.usuario;
    const baseWhere = {};
    const baseInclude = [];

    if (usuario && usuario.rol === 'Estudiante') {
      baseInclude.push({
        association: 'responsables',
        where: { id: usuario.id },
        required: true,
        attributes: []
      });
    } else if (usuario && usuario.rol === 'Docente') {
      baseWhere.creador_id = usuario.id;
    }

    const totalActividades = await Actividad.count({
      where: baseWhere,
      include: baseInclude
    });

    const actividadesPorEstado = await Actividad.findAll({
      where: baseWhere,
      attributes: [
        'estado_id',
        [Sequelize.fn('COUNT', Sequelize.col('Actividad.id')), 'total']
      ],
      include: [
        ...baseInclude,
        {
          model: Estado,
          as: 'estado',
          attributes: ['id', 'nombre']
        }
      ],
      group: ['estado_id', 'estado.id', 'estado.nombre'],
      raw: false
    });

    const actividadesPorPrioridad = await Actividad.findAll({
      where: baseWhere,
      include: baseInclude,
      attributes: [
        'prioridad',
        [Sequelize.fn('COUNT', Sequelize.col('Actividad.id')), 'total']
      ],
      group: ['prioridad']
    });

    const estadoCompletado = await Estado.obtenerPorNombre('Completado');

    let actividadesCompletadas = 0;
    let tareasVencidas = [];
    let tareasProximas = [];

    const hoy = new Date();
    // Vencen en los próximos 2 días
    const dosDiasMas = new Date(hoy);
    dosDiasMas.setDate(hoy.getDate() + 2);

    if (estadoCompletado) {
      actividadesCompletadas = await Actividad.count({
        where: {
          ...baseWhere,
          estado_id: estadoCompletado.id
        },
        include: baseInclude
      });

      tareasVencidas = await Actividad.findAll({
        where: {
          ...baseWhere,
          estado_id: { [Op.ne]: estadoCompletado.id },
          fecha_limite: { [Op.lt]: hoy }
        },
        include: baseInclude,
        order: [['fecha_limite', 'ASC']]
      });

      tareasProximas = await Actividad.findAll({
        where: {
          ...baseWhere,
          estado_id: { [Op.ne]: estadoCompletado.id },
          fecha_limite: {
            [Op.gte]: hoy,
            [Op.lte]: dosDiasMas
          }
        },
        include: baseInclude,
        order: [['fecha_limite', 'ASC']]
      });
    }

    const porcentajeCompletado =
      totalActividades === 0
        ? 0
        : Number(((actividadesCompletadas / totalActividades) * 100).toFixed(2));

    return successResponse(res, 200, 'Indicadores consultados correctamente', {
      totalActividades,
      actividadesCompletadas,
      porcentajeCompletado,
      actividadesPorEstado,
      actividadesPorPrioridad,
      tareasVencidas,
      tareasProximas
    });
  } catch (error) {
    return errorResponse(res, 500, 'Error al consultar dashboard', error.message);
  }
}

module.exports = {
  obtenerAvance
};