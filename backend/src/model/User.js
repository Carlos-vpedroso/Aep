
const { DataTypes } = require("sequelize");

const User = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
};

module.exports = User;
