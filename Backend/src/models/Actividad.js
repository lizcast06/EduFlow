const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/database');

class Actividad extends Model {
  static async listarConRelaciones(usuario, filtros = {}) {

    const where = {};

    const include = [
      {
        association: 'creador',
        attributes: ['id', 'nombre', 'email']
      },
      'evidencias',
      'comentarios',
      'historiales',
      {
        association: 'estado'
      },
      {
        association: 'asignaciones',
        include: [
          {
            association: 'usuario',
            attributes: ['id', 'nombre', 'email']
          }
        ]
      },
      {
        association: 'responsables',
        attributes: ['id', 'nombre', 'email']
      }
    ];

    // Filtro por prioridad
    if (filtros.prioridad) {
      where.prioridad = filtros.prioridad;
    }

    // Filtro por estado
    if (filtros.estado) {
      const estadoInclude = include.find(i => i.association === 'estado');
      estadoInclude.where = {
        nombre: filtros.estado
      };
      estadoInclude.required = true;
    }

    // Filtro por responsable
    if (filtros.responsable) {
      const responsablesInclude = include.find(
        i => i.association === 'responsables'
      );

      responsablesInclude.where = {
        id: filtros.responsable
      };

      responsablesInclude.required = true;
    }

    // RN-04
    if (usuario && usuario.rol === 'Estudiante') {

      const responsablesInclude = include.find(
        i => i.association === 'responsables'
      );

      responsablesInclude.where = {
        ...(responsablesInclude.where || {}),
        id: usuario.id
      };

      responsablesInclude.required = true;
    }

    return await Actividad.findAll({
      where,
      include,
      order: [['id', 'DESC']]
    });

  }

 static async obtenerDetalle(id) {
  return await Actividad.findByPk(id, {
    include: [
      {
        association: 'creador',
        attributes: ['id', 'nombre', 'email']
      },
      {
        association: 'estado'
      },
      'evidencias',
      'comentarios',
      {
        association: 'responsables',
        attributes: ['id', 'nombre', 'email']
      },
      {
        association: 'asignaciones',
        include: [
          {
            association: 'usuario',
            attributes: ['id', 'nombre', 'email']
          }
        ]
      },
      'historiales'
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
      type: DataTypes.ENUM('Baja', 'Media', 'Alta', 'Urgente'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['Baja', 'Media', 'Alta', 'Urgente']],
          msg: 'La prioridad debe ser Baja, Media, Alta o Urgente'
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