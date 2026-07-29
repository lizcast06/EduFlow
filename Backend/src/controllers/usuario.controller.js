const bcrypt = require('bcryptjs');
const { Usuario, Rol } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { isEmpty, isValidEmail, isValidPassword, isPositiveInteger } = require('../utils/validators');

async function listarEstudiantes(req, res) {
  try {
    const rolEstudiante = await Rol.findOne({ where: { nombre: 'Estudiante' } });
    
    if (!rolEstudiante) {
      return errorResponse(res, 404, 'Rol de estudiante no encontrado');
    }

    const estudiantes = await Usuario.findAll({
      where: { rol_id: rolEstudiante.id, activo: true },
      attributes: ['id', 'nombre', 'email']
    });

    return successResponse(res, 200, 'Estudiantes consultados correctamente', estudiantes);
  } catch (error) {
    return errorResponse(res, 500, 'Error al consultar estudiantes', error.message);
  }
}

async function listarUsuarios(req, res) {
  try {
    const usuarios = await Usuario.listarConRol();
    return successResponse(res, 200, 'Usuarios consultados correctamente', usuarios);
  } catch (error) {
    return errorResponse(res, 500, 'Error al consultar usuarios', error.message);
  }
}

async function crearUsuario(req, res) {
  try {
    const { nombre, email, password, rol_id } = req.body;

    if (isEmpty(nombre) || isEmpty(email) || isEmpty(password)) {
      return errorResponse(res, 400, 'Nombre, email y contraseña son obligatorios');
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, 400, 'El email no tiene un formato válido');
    }

    if (!isValidPassword(password)) {
      return errorResponse(res, 400, 'La contraseña debe tener al menos 6 caracteres');
    }

    if (!rol_id || !isPositiveInteger(rol_id)) {
      return errorResponse(res, 400, 'Rol inválido');
    }

    // RN-17: Validate unique email
    const usuarioExistente = await Usuario.obtenerPorEmail(email);
    if (usuarioExistente) {
      return errorResponse(res, 409, 'El correo electrónico ya está registrado en el sistema.');
    }

    const rolEncontrado = await Rol.obtenerPorId(rol_id);
    if (!rolEncontrado) {
      return errorResponse(res, 400, 'El rol indicado no existe');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: passwordHash,
      rol_id: rolEncontrado.id,
      activo: true
    });

    const usuarioConRol = await Usuario.obtenerPorId(nuevoUsuario.id);

    return successResponse(res, 201, 'Usuario creado correctamente', usuarioConRol);
  } catch (error) {
    return errorResponse(res, 500, 'Error al crear usuario', error.message);
  }
}

async function actualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const { nombre, email, rol_id } = req.body;

    if (!isPositiveInteger(id)) {
      return errorResponse(res, 400, 'ID de usuario inválido');
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return errorResponse(res, 404, 'Usuario no encontrado');
    }

    if (nombre && !isEmpty(nombre)) {
      usuario.nombre = nombre;
    }

    if (email && !isEmpty(email) && isValidEmail(email)) {
      // Check if email is used by another user
      if (email !== usuario.email) {
        const existente = await Usuario.obtenerPorEmail(email);
        if (existente) {
          return errorResponse(res, 409, 'El correo electrónico ya está registrado por otro usuario.');
        }
        usuario.email = email;
      }
    }

    if (rol_id && isPositiveInteger(rol_id)) {
      const rolEncontrado = await Rol.obtenerPorId(rol_id);
      if (!rolEncontrado) {
        return errorResponse(res, 400, 'El rol indicado no existe');
      }
      usuario.rol_id = rol_id;
    }

    await usuario.save();

    const usuarioActualizado = await Usuario.obtenerPorId(usuario.id);
    return successResponse(res, 200, 'Usuario actualizado correctamente', usuarioActualizado);
  } catch (error) {
    return errorResponse(res, 500, 'Error al actualizar usuario', error.message);
  }
}

async function cambiarEstadoUsuario(req, res) {
  try {
    const { id } = req.params;

    if (!isPositiveInteger(id)) {
      return errorResponse(res, 400, 'ID de usuario inválido');
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return errorResponse(res, 404, 'Usuario no encontrado');
    }

    // Toggle activo status
    usuario.activo = !usuario.activo;
    await usuario.save();

    const accion = usuario.activo ? 'activado' : 'desactivado';
    return successResponse(res, 200, `Usuario ${accion} correctamente`, usuario);
  } catch (error) {
    return errorResponse(res, 500, 'Error al cambiar estado del usuario', error.message);
  }
}

module.exports = {
  listarEstudiantes,
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario
};
