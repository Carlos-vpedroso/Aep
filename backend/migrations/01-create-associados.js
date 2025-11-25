"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("associados", {
      id: {
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      senha: { type: Sequelize.STRING, allowNull: false },
      cpf: { type: Sequelize.STRING(14), unique: true },
      rg: { type: Sequelize.STRING, unique: true },
      nome: { type: Sequelize.STRING, allowNull: false },
      telefone: Sequelize.STRING(15),
      foto: Sequelize.STRING,
      endereco: Sequelize.JSON,
      faculdade: Sequelize.STRING,
      curso: Sequelize.STRING,

      situacao: {
        type: Sequelize.ENUM("Pendente", "Ativo", "Inativo"),
        defaultValue: "Pendente",
      },

      cidadeTransporte: {
        type: Sequelize.ENUM("Franca", "Passos", "Batatais"),
        allowNull: true,
      },

      modalidadeTransporte: {
        type: Sequelize.ENUM("Mensalista", "Diarista"),
        allowNull: true,
      },

      confirmationToken: Sequelize.STRING,
      validado: { type: Sequelize.BOOLEAN, defaultValue: false },
      firstTime: { type: Sequelize.BOOLEAN, defaultValue: true },

      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("associados");
  },
};
