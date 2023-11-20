const { pool } = require("../../config/database");

module.exports = {
  async createProduct(req, res) {
    try {
      const { NOMBRE_PRODUCTO, PRECIO_PRODUCTO, STOCK_PRODUCTO } = req.body;

      const [result] = await pool.query(
        "INSERT INTO producto (NOMBRE_PRODUCTO, PRECIO_PRODUCTO,STOCK_PRODUCTO) VALUES (?, ?, ?)",
        [NOMBRE_PRODUCTO, PRECIO_PRODUCTO, STOCK_PRODUCTO]
      );

      res.status(200).json({
        message: "product created",
        product: {
          id: result.ID_PRODUCTO,
          NOMBRE_PRODUCTO,
          PRECIO_PRODUCTO,
          STOCK_PRODUCTO,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "product couldn't be created",
        data: error.message,
      });
    }
  },

  async findAllProducts(req, res) {
    try {
      const [result] = await pool.query("SELECT * FROM producto");

      res.status(200).json({
        message: "products found",
        productos: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "product couldn't be found",
        data: error.message,
      });
    }
  },

  async findOneProduct(req, res) {
    try {
      const { id } = req.params;

      const [result] = await pool.query(
        "SELECT * FROM producto WHERE ID_PRODUCTO = ?",
        id
      );

      if (result.length === 0) {
        res.status(404).json({
          message: "product not found",
        });
        return;
      }

      res.status(200).json({
        message: "product found",
        product: result[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "product couldn't be found",
        data: error.message,
      });
    }
  },

  async updateProduct(req, res) {
    try {
      await pool.query("UPDATE producto SET ? WHERE ID_PRODUCTO = ?", [
        req.body,
        req.params.id,
      ]);

      const [result] = await pool.query(
        "SELECT * FROM producto WHERE ID_PRODUCTO = ?",
        req.params.id
      );

      res.status(200).json({
        message: "producto updated",
        result: result[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "product couldn't be updated",
        data: error.message,
      });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const [result] = await pool.query(
        "DELETE FROM producto WHERE ID_PRODUCTO = ?",
        id
      );

      if (result.affectedRows === 0) {
        res.status(404).json({
          message: "product not found",
        });
        return;
      }

      res.status(204).json({
        message: "product deleted",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "product couldn't be deleted",
        data: error.message,
      });
    }
  },
};
