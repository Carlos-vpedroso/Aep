const { DataTypes } = require("sequelize");

const Rota = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cidade: {
    type: DataTypes.ENUM("Franca", "Passos", "Batatais"),
    allowNull: false,
  },
  turno: {
    type: DataTypes.ENUM("Matutino", "Noturno"),
    allowNull: false,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
};

module.exports = Rota;
