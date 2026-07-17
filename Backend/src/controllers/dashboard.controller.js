const { Sequelize } = require('sequelize');
const { Actividad, Estado } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

async function obtenerAvance(req, res) {
  try {
    const totalActividades = await Actividad.count();

    const actividadesPorEstado = await Actividad.findAll({
      attributes: [
        'estado_id',
        [Sequelize.fn('COUNT', Sequelize.col('Actividad.id')), 'total']
      ],
      include: [
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
      attributes: [
        'prioridad',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'total']
      ],
      group: ['prioridad']
    });

    const estadoCompletado = await Estado.obtenerPorNombre('Completado');

    let actividadesCompletadas = 0;

    if (estadoCompletado) {
      actividadesCompletadas = await Actividad.count({
        where: {
          estado_id: estadoCompletado.id
        }
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
      actividadesPorPrioridad
    });
  } catch (error) {
    return errorResponse(res, 500, 'Error al consultar dashboard', error.message);
  }
}

module.exports = {
  obtenerAvance
};