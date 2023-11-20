const { createPool } = require("mysql2/promise");

const pool = new createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1234567890",
  database: "dwadv",
});

module.exports = { pool };
