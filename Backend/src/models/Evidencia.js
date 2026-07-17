const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Evidencia extends Model {
  static async listarPorActividad(actividadId) {
    return await Evidencia.findAll({
      where: { actividad_id: actividadId },
      include: ['actividad', 'usuario'],
      order: [['fecha_subida', 'DESC']]
    });
  }

  static async obtenerPorId(id) {
    return await Evidencia.findByPk(id, {
      include: ['actividad', 'usuario']
    });
  }
}

Evidencia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    actividad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'La actividad debe ser un número entero'
        }
      }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'El usuario debe ser un número entero'
        }
      }
    },
    archivo_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La URL de evidencia no puede estar vacía'
        },
        isUrl: {
          msg: 'La evidencia debe ser una URL válida'
        }
      }
    },
    fecha_subida: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Evidencia',
    tableName: 'evidencia'
  }
);

module.exports = Evidencia;