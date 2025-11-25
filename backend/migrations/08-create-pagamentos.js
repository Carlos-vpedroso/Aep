"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pagamentos", {
      id: {
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      idAssociado: {
        type: Sequelize.STRING(36),
        references: { model: "associados", key: "id" },
        onDelete: "CASCADE",
      },

      tipo: {
        type: Sequelize.ENUM("Pix", "Boleto", "Manual"),
        allowNull: false,
      },

      referencia: { type: Sequelize.STRING, allowNull: false },

      valor: { type: Sequelize.DECIMAL(10, 2), allowNull: false },

      status: {
        type: Sequelize.ENUM("Pendente", "Pago", "Cancelado", "Expirado"),
        defaultValue: "Pendente",
      },

      txid: Sequelize.STRING,
      qr_code: Sequelize.TEXT,
      linhaDigitavel: Sequelize.STRING,
      linkBoleto: Sequelize.STRING,
      vencimento: Sequelize.DATE,
      dataPagamento: Sequelize.DATE,

      dataCriacao: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      metadata: Sequelize.JSON,

      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("pagamentos");
  },
};
