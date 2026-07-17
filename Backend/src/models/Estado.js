const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Estado extends Model {
  static async listarTodos() {
    return await Estado.findAll({
      order: [['id', 'ASC']]
    });
  }

  static async obtenerPorId(id) {
    return await Estado.findByPk(id);
  }

  static async obtenerPorNombre(nombre) {
    return await Estado.findOne({
      where: { nombre }
    });
  }
}

Estado.init(
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
          msg: 'El nombre del estado no puede estar vacío'
        },
        len: {
          args: [3, 50],
          msg: 'El nombre del estado debe tener entre 3 y 50 caracteres'
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'Estado',
    tableName: 'estado'
  }
);

module.exports = Estado;