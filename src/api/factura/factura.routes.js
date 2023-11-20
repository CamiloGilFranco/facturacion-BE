const Router = require("express");

const facturaController = require("./factura.controller");

const router = Router();

router.post("/", facturaController.createInvoice);
router.get("/", facturaController.findAllInvoices);
router.get("/:id", facturaController.findOneInvoice);
router.put("/:id", facturaController.updateInvoice);
router.delete("/:id", facturaController.deleteInvoice);
router.get("/report/main", facturaController.findReportData);

module.exports = router;
