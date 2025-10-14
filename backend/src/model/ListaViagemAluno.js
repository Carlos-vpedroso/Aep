const { DataTypes } = require("sequelize");

const ListaViagemAluno = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  idLista: {
    type: DataTypes.UUID,
    references: {
      model: "lista_viagens",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  idAssociado: {
    type: DataTypes.UUID,
    references: {
      model: "associados",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  embarque: DataTypes.STRING,
  desembarque: DataTypes.STRING,
  presenca: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

module.exports = ListaViagemAluno;
