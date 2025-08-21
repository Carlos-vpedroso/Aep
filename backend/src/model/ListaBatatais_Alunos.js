const { DataTypes } = require("sequelize");

const ListaBatataisAluno = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true,
    },
    idLista: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "ListaBatatais", 
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

module.exports = ListaBatataisAluno;
