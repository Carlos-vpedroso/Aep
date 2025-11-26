const { DataTypes } = require("sequelize");

const Associado = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false },
  cpf: { type: DataTypes.STRING(14), unique: true },
  rg: { type: DataTypes.STRING, unique: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  telefone: { type: DataTypes.STRING(15) },
  foto: { type: DataTypes.STRING },
  endereco: {
    type: DataTypes.JSON, // rua, número, bairro, cidade, cep
    allowNull: true,
  },
  faculdade: DataTypes.STRING,
  curso: DataTypes.STRING,
  situacao: {
    type: DataTypes.ENUM("Pendente", "Ativo", "Inativo"),
    defaultValue: "Pendente",
  },
  cidadeTransporte: {
    type: DataTypes.ENUM("Franca", "Passos", "Batatais"),
    allowNull: true,
  },
  modalidadeTransporte: {
    type: DataTypes.ENUM("Mensalista", "Diarista"),
    allowNull: true,
  },
  confirmationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  validado: { type: DataTypes.BOOLEAN, defaultValue: false },
  firstTime: { type: DataTypes.BOOLEAN, defaultValue: true },

  // 🚀 Campos para recuperação de senha
  forgotToken: { type: DataTypes.STRING, allowNull: true },
  forgotTokenExpires: { type: DataTypes.DATE, allowNull: true },
};

module.exports = Associado;
