const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Historial extends Model {}

Historial.init(
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
      allowNull: true // Puede ser null si es un evento automático del sistema sin autor claro
    },
    accion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    detalles: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Historial',
    tableName: 'historial',
    timestamps: false
  }
);

module.exports = Historial;
