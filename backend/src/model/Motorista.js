const { DataTypes } = require("sequelize");

const Motorista = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // gera um UUID automático
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
};

module.exports = Motorista;
