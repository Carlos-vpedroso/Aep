"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("associado_turnos", {
      id: {
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      idAssociado: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: "associados", key: "id" },
        onDelete: "CASCADE",
      },

      idTurno: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: "turnos", key: "id" },
        onDelete: "CASCADE",
      },

      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("associado_turnos");
  },
};
