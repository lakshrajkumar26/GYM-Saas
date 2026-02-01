const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load("./swagger.yaml");

module.exports = {
  swaggerUi,
  swaggerDocument
};
