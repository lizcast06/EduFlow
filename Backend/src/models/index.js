const sequelize = require('../config/database');

const Rol = require('./Rol');
const Estado = require('./Estado');
const Usuario = require('./Usuario');
const Actividad = require('./Actividad');
const Evidencia = require('./Evidencia');
const Comentario = require('./Comentario');
const Asignacion = require('./Asignacion');
const Historial = require('./Historial');
const Grupo = require('./Grupo');

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

Actividad.belongsToMany(Usuario, {
  through: Asignacion,
  foreignKey: 'actividad_id',
  otherKey: 'usuario_id',
  as: 'responsables'
});

Usuario.belongsToMany(Actividad, {
  through: Asignacion,
  foreignKey: 'usuario_id',
  otherKey: 'actividad_id',
  as: 'actividadesAsignadas'
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

Grupo.belongsTo(Usuario, {
  foreignKey: 'docente_id',
  as: 'docente'
});

Usuario.hasMany(Grupo, {
  foreignKey: 'docente_id',
  as: 'gruposCreados'
});

Grupo.belongsToMany(Usuario, {
  through: 'grupo_estudiante',
  foreignKey: 'grupo_id',
  otherKey: 'estudiante_id',
  as: 'estudiantes',
  timestamps: false
});

Usuario.belongsToMany(Grupo, {
  through: 'grupo_estudiante',
  foreignKey: 'estudiante_id',
  otherKey: 'grupo_id',
  as: 'grupos',
  timestamps: false
});

Grupo.hasMany(Actividad, {
  foreignKey: 'grupo_id',
  as: 'actividades'
});

Actividad.belongsTo(Grupo, {
  foreignKey: 'grupo_id',
  as: 'grupo'
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
  Historial,
  Grupo
};