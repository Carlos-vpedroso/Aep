const { DataTypes } = require("sequelize");

const Associado = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // gera um UUID automático
        primaryKey: true,
    },
    // Dados Usuário
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING(14),
        allowNull: true,
        unique: true,
    },
    rg: {
        type: DataTypes.STRING,
        allowNull: true,
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

    //endereço
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

    //Solicitação faculdade
    faculdade: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    curso: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    turno: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    situacao: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Pendente",
    },
    cidadeTransporte: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    modalidadeTransporte: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    //Token de Verificação email
    confirmationToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    validado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },

    // Validação para primeiro formulário
    firstTime: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
};

module.exports = Associado;
