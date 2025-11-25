"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("lista_viagens", {
      id: {
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      data: { type: Sequelize.DATEONLY, allowNull: false },

      idRota: {
        type: Sequelize.STRING(36),
        references: { model: "rotas", key: "id" },
        onDelete: "CASCADE",
      },

      status: {
        type: Sequelize.ENUM("Aberta", "Encerrada", "Cancelada"),
        defaultValue: "Aberta",
      },

      criadaAutomaticamente: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("lista_viagens");
  },
};
