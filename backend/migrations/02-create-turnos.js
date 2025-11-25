"use strict";


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("turnos", {
      id: {
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      nome: { type: Sequelize.STRING, allowNull: false, unique: true },

      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("turnos");
  },
};
