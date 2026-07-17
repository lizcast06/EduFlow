const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Actividad extends Model {
  static async listarConRelaciones() {
    return await Actividad.findAll({
      include: [
        'creador', 
        'estado', 
        'evidencias', 
        'comentarios', 
        { association: 'asignaciones', include: ['usuario'] }
      ],
      order: [['id', 'DESC']]
    });
  }

  static async obtenerDetalle(id) {
    return await Actividad.findByPk(id, {
      include: [
        'creador', 
        'estado', 
        'evidencias', 
        'comentarios', 
        { association: 'asignaciones', include: ['usuario'] }
      ]
    });
  }

  static async cambiarEstado(id, estadoId) {
    const actividad = await Actividad.findByPk(id);

    if (!actividad) {
      return null;
    }

    actividad.estado_id = estadoId;
    await actividad.save();

    return await Actividad.obtenerDetalle(id);
  }
}

Actividad.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El título no puede estar vacío'
        },
        len: {
          args: [3, 100],
          msg: 'El título debe tener entre 3 y 100 caracteres'
        }
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_limite: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'La fecha límite debe ser una fecha válida'
        }
      }
    },
    prioridad: {
      type: DataTypes.ENUM('Alta', 'Media', 'Baja'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['Alta', 'Media', 'Baja']],
          msg: 'La prioridad debe ser Alta, Media o Baja'
        }
      }
    },
    estado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'El estado debe ser un número entero'
        }
      }
    },
    creador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'El creador debe ser un número entero'
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'Actividad',
    tableName: 'actividad'
  }
);

module.exports = Actividad;