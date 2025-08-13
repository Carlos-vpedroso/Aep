const { DataTypes } = require("sequelize");

const Associado = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // gera um UUID automático
        primaryKey: true,
    },
    cpf: {
        type: DataTypes.STRING(14),
        allowNull: false,
        unique: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    telefone: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    rua: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bairro: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cidade: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cep: {
        type: DataTypes.STRING,
        allowNull: true,
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
    turno: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    situacao: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cidadeTransporte: {
        type: DataTypes.STRING,
        allowNull: true,
    },
};

module.exports = Associado;
