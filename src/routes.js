const healthcheck = require("./api/healthcheck/healthcheck");
const productos = require("./api/productos/productos.routes");
const clientes = require("./api/clientes/clientes.routes");
const factura = require("./api/factura/factura.routes");

const routes = (app) => {
  app.use("/api/healthcheck", healthcheck);
  app.use("/api/productos", productos);
  app.use("/api/clientes", clientes);
  app.use("/api/factura", factura);
};

module.exports = routes;
