const express = require("express");
const configExpress = require("./config/express");
const routes = require("./routes");
const { pool } = require("./config/database");

const app = express();

configExpress(app);

routes(app);

module.exports = app;
