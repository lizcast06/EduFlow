const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Usuario, Rol } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const {
  isEmpty,
  isValidEmail,
  isValidPassword,
  isPositiveInteger
} = require('../utils/validators');

function generarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol_id: usuario.rol_id
    },
    process.env.JWT_SECRET || 'eduflow_secret_key',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h'
    }
  );
}

function ocultarPassword(usuario) {
  const data = usuario.toJSON ? usuario.toJSON() : usuario;
  delete data.password;
  return data;
}

async function register(req, res) {
  try {
    const { nombre, email, password, rol_id, rol } = req.body;

    if (isEmpty(nombre) || isEmpty(email) || isEmpty(password)) {
      return errorResponse(res, 400, 'Nombre, email y contraseña son obligatorios');
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, 400, 'El email no tiene un formato válido');
    }

    if (!isValidPassword(password)) {
      return errorResponse(res, 400, 'La contraseña debe tener al menos 6 caracteres');
    }

    const usuarioExistente = await Usuario.obtenerPorEmail(email);

    if (usuarioExistente) {
      return errorResponse(res, 409, 'El email ya se encuentra registrado');
    }

    let rolEncontrado = null;

    if (rol_id) {
      if (!isPositiveInteger(rol_id)) {
        return errorResponse(res, 400, 'El rol_id debe ser un número válido');
      }

      rolEncontrado = await Rol.obtenerPorId(rol_id);
    } else if (rol) {
      rolEncontrado = await Rol.obtenerPorNombre(rol);
    } else {
      rolEncontrado = await Rol.obtenerPorNombre('Estudiante');
    }

    if (!rolEncontrado) {
      return errorResponse(res, 400, 'El rol indicado no existe');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: passwordHash,
      rol_id: rolEncontrado.id
    });

    const usuarioConRol = await Usuario.obtenerPorId(nuevoUsuario.id);
    const token = generarToken(usuarioConRol);

    return successResponse(res, 201, 'Usuario registrado correctamente', {
      usuario: ocultarPassword(usuarioConRol),
      token
    });
  } catch (error) {
    return errorResponse(res, 500, 'Error al registrar usuario', error.message);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (isEmpty(email) || isEmpty(password)) {
      return errorResponse(res, 400, 'Email y contraseña son obligatorios');
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, 400, 'El email no tiene un formato válido');
    }

    const usuario = await Usuario.obtenerPorEmail(email);

    if (!usuario) {
      return errorResponse(res, 401, 'Credenciales incorrectas');
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      return errorResponse(res, 401, 'Credenciales incorrectas');
    }

    const token = generarToken(usuario);

    return successResponse(res, 200, 'Inicio de sesión correcto', {
      usuario: ocultarPassword(usuario),
      token
    });
  } catch (error) {
    return errorResponse(res, 500, 'Error al iniciar sesión', error.message);
  }
}

async function logout(req, res) {
  return successResponse(res, 200, 'Sesión cerrada correctamente. El token debe eliminarse del cliente.');
}

module.exports = {
  register,
  login,
  logout
};