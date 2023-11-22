require("dotenv").config();
const server = require("./app");
const PORT = require("./constants/server");

const startServer = () => {
  server.listen(PORT, () => {
    console.log(`App running in http://localhost:${PORT.port}`);
  });
};

setImmediate(startServer);

module.exports = server;
