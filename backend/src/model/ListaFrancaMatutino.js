const { DataTypes } = require("sequelize");

const ListaFrancaMatutino = {
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

module.exports = ListaFrancaMatutino;
