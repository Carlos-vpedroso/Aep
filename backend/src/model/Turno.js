const { DataTypes } = require("sequelize");

const Turno = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // "Matutino", "Noturno"
  },
};

module.exports = Turno;
