const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Comentario extends Model {
  static async listarPorActividad(actividadId) {
    return await Comentario.findAll({
      where: { actividad_id: actividadId },
      include: ['actividad', 'usuario'],
      order: [['fecha', 'ASC']]
    });
  }

  static async obtenerPorId(id) {
    return await Comentario.findByPk(id, {
      include: ['actividad', 'usuario']
    });
  }
}

Comentario.init(
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
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El comentario no puede estar vacío'
        },
        len: {
          args: [1, 5000],
          msg: 'El comentario debe tener contenido válido'
        }
      }
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Comentario',
    tableName: 'comentario'
  }
);

module.exports = Comentario;