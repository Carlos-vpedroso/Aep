"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rotas", {
      id: {
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      cidade: {
        type: Sequelize.ENUM("Franca", "Passos", "Batatais"),
        allowNull: false,
      },

      turno: {
        type: Sequelize.ENUM("Matutino", "Noturno"),
        allowNull: false,
      },

      ativo: { type: Sequelize.BOOLEAN, defaultValue: true },

      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("rotas");
  },
};
