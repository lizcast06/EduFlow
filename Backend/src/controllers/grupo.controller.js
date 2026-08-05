const { Grupo, Usuario } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const crypto = require('crypto');

async function crearGrupo(req, res) {
  try {
    const { nombre } = req.body;
    if (!nombre || nombre.trim() === '') {
      return errorResponse(res, 400, 'El nombre del grupo es obligatorio');
    }

    const codigo_acceso = crypto.randomBytes(4).toString('hex').toUpperCase();

    const nuevoGrupo = await Grupo.create({
      nombre,
      codigo_acceso,
      docente_id: req.usuario.id
    });

    return successResponse(res, 201, 'Grupo creado correctamente', nuevoGrupo);
  } catch (error) {
    return errorResponse(res, 500, 'Error al crear grupo', error.message);
  }
}

async function listarGrupos(req, res) {
  try {
    let grupos;
    if (req.usuario.rol === 'Docente' || req.usuario.rol === 'Administrador') {
      grupos = await Grupo.findAll({
        where: { docente_id: req.usuario.id },
        include: [
          {
            association: 'estudiantes',
            attributes: ['id', 'nombre', 'email']
          }
        ]
      });
    } else {
      const estudiante = await Usuario.findByPk(req.usuario.id, {
        include: [
          {
            association: 'grupos',
            include: [
              {
                association: 'docente',
                attributes: ['id', 'nombre']
              }
            ]
          }
        ]
      });
      grupos = estudiante.grupos;
    }

    return successResponse(res, 200, 'Grupos consultados', grupos);
  } catch (error) {
    return errorResponse(res, 500, 'Error al listar grupos', error.message);
  }
}

async function unirseAGrupo(req, res) {
  try {
    const { codigo_acceso } = req.body;
    if (!codigo_acceso) {
      return errorResponse(res, 400, 'El código de acceso es obligatorio');
    }

    const grupo = await Grupo.findOne({ where: { codigo_acceso } });
    if (!grupo) {
      return errorResponse(res, 404, 'Código de acceso no válido o grupo inexistente');
    }

    const estudiante = await Usuario.findByPk(req.usuario.id);
    const pertenece = await grupo.hasEstudiante(estudiante);
    if (pertenece) {
      return errorResponse(res, 400, 'Ya perteneces a este grupo');
    }

    await grupo.addEstudiante(estudiante);
    return successResponse(res, 200, 'Te has unido al grupo exitosamente', {
      grupo: { id: grupo.id, nombre: grupo.nombre }
    });
  } catch (error) {
    return errorResponse(res, 500, 'Error al unirse al grupo', error.message);
  }
}

module.exports = {
  crearGrupo,
  listarGrupos,
  unirseAGrupo
};
