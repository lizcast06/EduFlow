const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Rol extends Model {
  static async listarTodos() {
    return await Rol.findAll({
      order: [['id', 'ASC']]
    });
  }

  static async obtenerPorId(id) {
    return await Rol.findByPk(id);
  }

  static async obtenerPorNombre(nombre) {
    return await Rol.findOne({
      where: { nombre }
    });
  }
}

Rol.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El nombre del rol no puede estar vacío'
        },
        len: {
          args: [3, 50],
          msg: 'El nombre del rol debe tener entre 3 y 50 caracteres'
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'Rol',
    tableName: 'rol'
  }
);

module.exports = Rol;