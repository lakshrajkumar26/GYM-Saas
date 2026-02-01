const express = require("express");
const routes = require("./routes");
const { swaggerUi, swaggerDocument } = require("./swagger");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use("/api", routes);

module.exports = app;
