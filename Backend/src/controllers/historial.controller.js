const { Historial, Usuario } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

async function listarPorActividad(req, res) {
  try {
    const { id_actividad } = req.params;

    const historial = await Historial.findAll({
      where: { actividad_id: id_actividad },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email']
        }
      ],
      order: [['fecha', 'DESC']]
    });

    return successResponse(res, 200, 'Historial consultado correctamente', historial);
  } catch (error) {
    return errorResponse(res, 500, 'Error al consultar historial', error.message);
  }
}

module.exports = {
  listarPorActividad
};
