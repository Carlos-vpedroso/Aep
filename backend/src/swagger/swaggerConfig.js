const swaggerJSDoc = require("swagger-jsdoc");


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API da Associação",
      version: "1.0.0",
      description: "Documentação da API com Swagger",
    },
  },
  apis: ["../docs/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
