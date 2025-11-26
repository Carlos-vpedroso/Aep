require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || "mysql",
  },
  production: {
    url: process.env.MYSQL_PUBLIC_URL,
    dialect: "mysql",
  },
};
// para subir a atualização das migrations para o banco em produção
// npx sequelize-cli db:migrate --env production
