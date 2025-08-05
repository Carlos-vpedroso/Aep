const { sequelize } = require('../database');
const userModel = require('../model/User');

const userViewModel = sequelize.define('User', userModel, {
  tableName: 'users', // opcional: define o nome exato da tabela
  timestamps: true,   // ou false, dependendo se você quer createdAt/updatedAt
});

module.exports = userViewModel;
