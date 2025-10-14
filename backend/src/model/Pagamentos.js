const { DataTypes } = require("sequelize");

const Pagamento = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  idAssociado: {
    type: DataTypes.UUID,
    references: {
      model: "associados",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  tipo: {
    type: DataTypes.ENUM("Pix", "Boleto", "Manual"),
    allowNull: false,
  },
  referencia: {
    type: DataTypes.STRING, // "Mensalidade-2025-10" ou "Viagem-2025-10-14"
    allowNull: false,
  },
  valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: {
    type: DataTypes.ENUM("Pendente", "Pago", "Cancelado", "Expirado"),
    defaultValue: "Pendente",
  },
  // PIX
  txid: DataTypes.STRING,
  qr_code: DataTypes.TEXT,

  // BOLETO
  linhaDigitavel: DataTypes.STRING,
  linkBoleto: DataTypes.STRING,
  vencimento: DataTypes.DATE,

  // DATAS
  dataPagamento: DataTypes.DATE,
  dataCriacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

module.exports = Pagamento;
