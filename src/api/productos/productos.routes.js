const Router = require("express");
const productosController = require("./productos.controller");

const router = Router();

router.post("/", productosController.createProduct);
router.get("/", productosController.findAllProducts);
router.get("/:id", productosController.findOneProduct);
router.put("/:id", productosController.updateProduct);
router.delete("/:id", productosController.deleteProduct);

module.exports = router;
