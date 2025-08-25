const { DataTypes } = require("sequelize");

const Diretoria = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // gera um UUID automático
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
};

module.exports = Diretoria;
