const Router = require("express");
const clientesController = require("./clientes.controller");

const router = Router();

router.post("/", clientesController.createClient);
router.get("/", clientesController.findAllClients);
router.get("/:id", clientesController.findOneCLient);
router.put("/:id", clientesController.updateClient);
router.delete("/", clientesController.deleteClient);

module.exports = router;
