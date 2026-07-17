require('dotenv').config();

const {
  sequelize,
  Rol,
  Estado,
  Usuario,
  Actividad
} = require('../models');

async function probarModelos() {
  try {
    console.log('Probando conexión con MySQL...');

    await sequelize.authenticate();

    console.log('Conexión a MySQL exitosa.');

    const roles = await Rol.listarTodos();
    console.log('\nRoles registrados:');
    console.table(roles.map((rol) => rol.toJSON()));

    const estados = await Estado.listarTodos();
    console.log('\nEstados registrados:');
    console.table(estados.map((estado) => estado.toJSON()));

    const usuarios = await Usuario.listarConRol();
    console.log('\nUsuarios consultados con relación a Rol:');
    console.table(usuarios.map((usuario) => usuario.toJSON()));

    const actividades = await Actividad.listarConRelaciones();
    console.log('\nActividades consultadas con relaciones:');
    console.log(JSON.stringify(actividades.map((actividad) => actividad.toJSON()), null, 2));

    console.log('\nModelos, validaciones, relaciones y métodos de acceso cargados correctamente.');
  } catch (error) {
    console.error('\nError al probar los modelos:');
    console.error(error.message);
  } finally {
    await sequelize.close();
  }
}

probarModelos();