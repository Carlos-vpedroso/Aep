"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("motoristas", {
      id: {
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      nome: { type: Sequelize.STRING, allowNull: false },
      login: { type: Sequelize.STRING, allowNull: false, unique: true },
      senha: { type: Sequelize.STRING, allowNull: false },

      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("motoristas");
  },
};
