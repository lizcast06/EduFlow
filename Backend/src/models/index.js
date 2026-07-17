const sequelize = require('../config/database');

const Rol = require('./Rol');
const Estado = require('./Estado');
const Usuario = require('./Usuario');
const Actividad = require('./Actividad');
const Evidencia = require('./Evidencia');
const Comentario = require('./Comentario');
const Asignacion = require('./Asignacion');
const Historial = require('./Historial');

Rol.hasMany(Usuario, {
  foreignKey: 'rol_id',
  as: 'usuarios'
});

Usuario.belongsTo(Rol, {
  foreignKey: 'rol_id',
  as: 'rol'
});

Usuario.hasMany(Actividad, {
  foreignKey: 'creador_id',
  as: 'actividadesCreadas'
});

Actividad.belongsTo(Usuario, {
  foreignKey: 'creador_id',
  as: 'creador'
});

Estado.hasMany(Actividad, {
  foreignKey: 'estado_id',
  as: 'actividades'
});

Actividad.belongsTo(Estado, {
  foreignKey: 'estado_id',
  as: 'estado'
});

Actividad.hasMany(Evidencia, {
  foreignKey: 'actividad_id',
  as: 'evidencias'
});

Evidencia.belongsTo(Actividad, {
  foreignKey: 'actividad_id',
  as: 'actividad'
});

Usuario.hasMany(Evidencia, {
  foreignKey: 'usuario_id',
  as: 'evidencias'
});

Evidencia.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

Actividad.hasMany(Comentario, {
  foreignKey: 'actividad_id',
  as: 'comentarios'
});

Comentario.belongsTo(Actividad, {
  foreignKey: 'actividad_id',
  as: 'actividad'
});

Usuario.hasMany(Comentario, {
  foreignKey: 'usuario_id',
  as: 'comentarios'
});

Comentario.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

Actividad.hasMany(Asignacion, {
  foreignKey: 'actividad_id',
  as: 'asignaciones'
});

Asignacion.belongsTo(Actividad, {
  foreignKey: 'actividad_id',
  as: 'actividad'
});

Usuario.hasMany(Asignacion, {
  foreignKey: 'usuario_id',
  as: 'asignaciones'
});

Asignacion.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

Actividad.hasMany(Historial, {
  foreignKey: 'actividad_id',
  as: 'historiales'
});

Historial.belongsTo(Actividad, {
  foreignKey: 'actividad_id',
  as: 'actividad'
});

Usuario.hasMany(Historial, {
  foreignKey: 'usuario_id',
  as: 'historiales'
});

Historial.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

module.exports = {
  sequelize,
  Rol,
  Estado,
  Usuario,
  Actividad,
  Evidencia,
  Comentario,
  Asignacion,
  Historial
};