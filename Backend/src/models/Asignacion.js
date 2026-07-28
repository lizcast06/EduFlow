const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Asignacion extends Model {
  static async listarPorActividad(actividadId) {
    return await Asignacion.findAll({
      where: { actividad_id: actividadId },
      include: ['actividad', 'usuario'],
      order: [['fecha_asignacion', 'DESC']]
    });
  }

  static async obtenerAsignacion(actividadId, usuarioId) {
    return await Asignacion.findOne({
      where: {
        actividad_id: actividadId,
        usuario_id: usuarioId
      }
    });
  }
}

Asignacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    actividad_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_asignacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Asignacion',
    tableName: 'asignacion'
  }
);

module.exports = Asignacion;