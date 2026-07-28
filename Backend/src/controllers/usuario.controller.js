const { Usuario, Rol } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

async function listarEstudiantes(req, res) {
  try {
    const rolEstudiante = await Rol.findOne({ where: { nombre: 'Estudiante' } });
    
    if (!rolEstudiante) {
      return errorResponse(res, 404, 'Rol de estudiante no encontrado');
    }

    const estudiantes = await Usuario.findAll({
      where: { rol_id: rolEstudiante.id },
      attributes: ['id', 'nombre', 'email']
    });

    return successResponse(res, 200, 'Estudiantes consultados correctamente', estudiantes);
  } catch (error) {
    return errorResponse(res, 500, 'Error al consultar estudiantes', error.message);
  }
}

module.exports = {
  listarEstudiantes
};
