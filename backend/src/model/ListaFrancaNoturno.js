const { DataTypes } = require("sequelize");

const ListaFrancaNoturno = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // gera um UUID automático
        primaryKey: true,
    },
    data: {
        type: DataTypes.DATEONLY, // Apenas a data, sem hora
        allowNull: false,
        unique: true, // garante que só exista uma lista por dia
    },
};

module.exports = ListaFrancaNoturno;
