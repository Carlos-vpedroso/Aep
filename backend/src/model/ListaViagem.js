const { DataTypes } = require("sequelize");

const ListaViagem = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  idRota: {
    type: DataTypes.UUID,
    references: {
      model: "rotas",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  status: {
    type: DataTypes.ENUM("Aberta", "Encerrada", "Cancelada"),
    defaultValue: "Aberta",
  },
  criadaAutomaticamente: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // para diferenciar listas criadas pelo cron
  },
};

module.exports = ListaViagem;