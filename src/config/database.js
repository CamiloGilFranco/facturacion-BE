const { createPool } = require("mysql2/promise");
const { databaseConfig } = require("../constants/database");

const pool = new createPool({
  host: databaseConfig.host,
  port: databaseConfig.port,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database,
});

module.exports = { pool };
