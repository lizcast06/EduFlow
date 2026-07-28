const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Usuario extends Model {
  static async listarConRol() {
    return await Usuario.findAll({
      include: ['rol'],
      order: [['id', 'ASC']]
    });
  }

  static async obtenerPorId(id) {
    return await Usuario.findByPk(id, {
      include: ['rol']
    });
  }

  static async obtenerPorEmail(email) {
    return await Usuario.scope('conPassword').findOne({
      where: { email },
      include: ['rol']
    });
  }
}

Usuario.init(
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
          msg: 'El nombre del usuario no puede estar vacío'
        },
        len: {
          args: [2, 100],
          msg: 'El nombre debe tener entre 2 y 100 caracteres'
        }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El email no puede estar vacío'
        },
        isEmail: {
          msg: 'Debe ingresar un email válido'
        }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La contraseña no puede estar vacía'
        },
        len: {
          args: [6, 255],
          msg: 'La contraseña debe tener al menos 6 caracteres'
        }
      }
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'El rol debe ser un número entero'
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuario',
    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    },
    scopes: {
      conPassword: {
        attributes: {
          include: ['password']
        }
      }
    }
  }
);

module.exports = Usuario;