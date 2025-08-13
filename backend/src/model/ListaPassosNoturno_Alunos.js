const { DataTypes } = require("sequelize");

const ListaPassosNoturnoAluno = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // gera um UUID automático
        primaryKey: true,
    },
    idLista: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "ListaPassosNoturno",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    idAluno: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "associados",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    nomeAluno: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    embarque: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    desembarque: {
        type: DataTypes.STRING,
        allowNull: true,
    },
};

module.exports = ListaPassosNoturnoAluno;
