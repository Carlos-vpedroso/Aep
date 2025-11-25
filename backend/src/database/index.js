const { Sequelize } = require("sequelize");

const sequelize = process.env.MYSQL_PUBLIC_URL
  ? new Sequelize(process.env.MYSQL_PUBLIC_URL, {
      dialect: "mysql",
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT || 3306,
        logging: false,
      }
    );

// Testa conexão
async function connect() {
  try {
    await sequelize.authenticate();
    console.log("(Conexão com banco de dados bem-sucedida).");
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);
  }
}

module.exports = {
  sequelize,
  connect,
};
