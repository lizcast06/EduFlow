const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Grupo extends Model {}

Grupo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre del grupo no puede estar vacío'
        }
      }
    },
    codigo_acceso: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El código de acceso no puede estar vacío'
        }
      }
    },
    docente_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Grupo',
    tableName: 'grupo',
    timestamps: true, // created_at is managed, but let's use the DB's default CURRENT_TIMESTAMP by keeping it false and using our explicit column if needed, or mapping it.
    createdAt: 'created_at',
    updatedAt: false
  }
);

module.exports = Grupo;
