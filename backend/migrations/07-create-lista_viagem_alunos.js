"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("lista_viagem_alunos", {
      id: {
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      idLista: {
        type: Sequelize.STRING(36),
        references: { model: "lista_viagens", key: "id" },
        onDelete: "CASCADE",
      },

      idAssociado: {
        type: Sequelize.STRING(36),
        references: { model: "associados", key: "id" },
        onDelete: "CASCADE",
      },

      embarque: Sequelize.STRING,
      desembarque: Sequelize.STRING,
      presenca: { type: Sequelize.BOOLEAN, defaultValue: false },

      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("lista_viagem_alunos");
  },
};
