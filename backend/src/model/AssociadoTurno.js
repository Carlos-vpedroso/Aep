const { DataTypes } = require("sequelize");

const AssociadoTurno = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  idAssociado: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "associados", key: "id" },
    onDelete: "CASCADE",
  },
  idTurno: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "turnos", key: "id" },
    onDelete: "CASCADE",
  },
};

module.exports = AssociadoTurno;