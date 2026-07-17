const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Asignacion extends Model {}

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
    tableName: 'asignacion',
    timestamps: false
  }
);

module.exports = Asignacion;
