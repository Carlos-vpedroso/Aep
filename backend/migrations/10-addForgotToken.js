"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("associados", "forgotToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("associados", "forgotTokenExpires", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("associados", "forgotToken");
    await queryInterface.removeColumn("associados", "forgotTokenExpires");
  },
};
