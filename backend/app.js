const express = require("express");
const app = express();

// Middlewares
app.use(express.json());

// Cors
const cors = require("cors");
app.use(cors());

// Rotas
const routes = require("./src/routes/index");
app.use("/api", routes);

// Cron Jobs
//require('./src/cronjob/createListasCron') // inicia os cron jobs

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/swagger/swaggerConfig");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
