const { pool } = require("../../config/database");

module.exports = {
  async createInvoice(req, res) {
    try {
      const { ID_CLIENTE, VALOR_FACTURA, productos } = req.body;

      const connection = await pool.getConnection();

      let done = true;

      console.log(req.body);

      try {
        const [result] = await pool.query(
          "INSERT INTO factura (ID_CLIENTE, VALOR_FACTURA) VALUES (?, ?)",
          [ID_CLIENTE, VALOR_FACTURA]
        );

        const NUMERO_FACTURA = result.insertId;

        productos.forEach(async (product) => {
          await pool.query(
            "INSERT INTO detalle_fac (NUMERO_FACTURA, ID_PRODUCTO, CANTIDA_PRODUCTO, VALOR_PRODUCTO) VALUES (?, ?, ?, ?)",
            [
              NUMERO_FACTURA,
              product.ID_PRODUCTO,
              product.cantidad,
              product.PRECIO_PRODUCTO * product.cantidad,
            ]
          );

          await pool.query(
            "UPDATE producto SET STOCK_PRODUCTO = ? WHERE ID_PRODUCTO = ?",
            [product.newStock, product.ID_PRODUCTO]
          );
        });

        await connection.commit();
      } catch (error) {
        await connection.rollBack();
        console.log(error);
        done = false;
      } finally {
        connection.release();
      }

      if (!done) {
        throw new Error("Error en la transacción");
      }

      res.status(200).json({
        message: "invoice created",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "invoice couldn't be created",
        data: error.message,
      });
    }
  },

  async findAllInvoices(req, res) {
    try {
      const [result] = await pool.query(
        "SELECT f.NUMERO_FACTURA, f.FECHA_FACTURA, f.VALOR_FACTURA, c.ID_CLIENTE, c.NOMBRE_CLIENTE, c.DIRECCIO_CLIENTE, c.TELEFON_CLIENTE, d.ID_PRODUCTO, p.NOMBRE_PRODUCTO, p.PRECIO_PRODUCTO, d.CANTIDA_PRODUCTO, d.VALOR_PRODUCTO FROM factura f JOIN cliente c ON f.ID_CLIENTE = c.ID_CLIENTE JOIN detalle_fac d ON f.NUMERO_FACTURA = d.NUMERO_FACTURA JOIN producto p ON d.ID_PRODUCTO = p.ID_PRODUCTO"
      );

      const formattedResult = [];

      result.forEach((row) => {
        let matchingResult = formattedResult.find(
          (item) => item.NUMERO_FACTURA === row.NUMERO_FACTURA
        );

        if (!matchingResult) {
          matchingResult = {
            NUMERO_FACTURA: row.NUMERO_FACTURA,
            FECHA_FACTURA: row.FECHA_FACTURA,
            VALOR_FACTURA: row.VALOR_FACTURA,
            CLIENTE: {
              ID_CLIENTE: row.ID_CLIENTE,
              NOMBRE_CLIENTE: row.NOMBRE_CLIENTE,
              DIRECCIO_CLIENTE: row.DIRECCIO_CLIENTE,
              TELEFON_CLIENTE: row.TELEFON_CLIENTE,
            },
            DETALLE: [],
          };

          formattedResult.push(matchingResult);
        }

        matchingResult.DETALLE.push({
          ID_FACTURA: row.ID_FACTURA,
          NOMBRE_PRODUCTO: row.NOMBRE_PRODUCTO,
          PRECIO_PRODUCTO: row.PRECIO_PRODUCTO,
          CANTIDA_PRODUCTO: row.CANTIDA_PRODUCTO,
          VALOR_PRODUCTO: row.VALOR_PRODUCTO,
        });
      });

      res.status(200).json({
        message: "invoices found",
        facturas: formattedResult,
        result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "clients couldn't be found",
        data: error.message,
      });
    }
  },

  async findOneInvoice(req, res) {
    try {
      const { id } = req.params;

      const [result] = await pool.query(
        "SELECT f.NUMERO_FACTURA, f.FECHA_FACTURA, f.VALOR_FACTURA, c.ID_CLIENTE, c.NOMBRE_CLIENTE, c.DIRECCIO_CLIENTE, c.TELEFON_CLIENTE, d.ID_PRODUCTO, p.NOMBRE_PRODUCTO, p.PRECIO_PRODUCTO, d.CANTIDA_PRODUCTO, d.VALOR_PRODUCTO FROM factura f JOIN cliente c ON f.ID_CLIENTE = c.ID_CLIENTE JOIN detalle_fac d ON f.NUMERO_FACTURA = d.NUMERO_FACTURA JOIN producto p ON d.ID_PRODUCTO = p.ID_PRODUCTO WHERE f.NUMERO_FACTURA = ?",
        id
      );

      if (result.length === 0) {
        res.status(404).json({
          message: "invoice not found",
        });
        return;
      }

      const formattedResult = [];

      result.forEach((row) => {
        let matchingResult = formattedResult.find(
          (item) => item.NUMERO_FACTURA === row.NUMERO_FACTURA
        );

        if (!matchingResult) {
          matchingResult = {
            NUMERO_FACTURA: row.NUMERO_FACTURA,
            FECHA_FACTURA: row.FECHA_FACTURA,
            VALOR_FACTURA: row.VALOR_FACTURA,
            CLIENTE: {
              ID_CLIENTE: row.ID_CLIENTE,
              NOMBRE_CLIENTE: row.NOMBRE_CLIENTE,
              DIRECCIO_CLIENTE: row.DIRECCIO_CLIENTE,
              TELEFON_CLIENTE: row.TELEFON_CLIENTE,
            },
            DETALLE: [],
          };

          formattedResult.push(matchingResult);
        }

        matchingResult.DETALLE.push({
          ID_FACTURA: row.ID_FACTURA,
          NOMBRE_PRODUCTO: row.NOMBRE_PRODUCTO,
          PRECIO_PRODUCTO: row.PRECIO_PRODUCTO,
          CANTIDA_PRODUCTO: row.CANTIDA_PRODUCTO,
          VALOR_PRODUCTO: row.VALOR_PRODUCTO,
        });
      });

      res.status(200).json({
        message: "invoice found",
        factura: formattedResult[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "invoice couldn't be found",
        data: error.message,
      });
    }
  },

  async updateInvoice(req, res) {
    try {
      await pool.query("UPDATE cliente SET ? WHERE ID_CLIENTE = ?", [
        req.body,
        req.params.id,
      ]);

      const [result] = await pool.query(
        "SELECT * FROM cliente WHERE id = ?",
        req.params.id
      );

      res.status(200).json({
        message: "client updated",
        result: result[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "client couldn't be updated",
        data: error.message,
      });
    }
  },

  async deleteInvoice(req, res) {
    try {
      const { id } = req.params;

      const [result] = await pool.query(
        "DELETE FROM factura WHERE NUMERO_FACTURA = ?",
        id
      );

      if (result.affectedRows === 0) {
        res.status(404).json({
          message: "invoice not found",
        });
        return;
      }

      res.status(204).json({
        message: "invoice deleted",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "invoice couldn't be deleted",
        data: error.message,
      });
    }
  },

  async findReportData(req, res) {
    try {
      const [result] = await pool.query(
        "SELECT p.NOMBRE_PRODUCTO, p.STOCK_PRODUCTO, p.PRECIO_PRODUCTO, COALESCE(SUM(df.CANTIDA_PRODUCTO), 0) AS vendidos, COALESCE(SUM(df.CANTIDA_PRODUCTO) * p.PRECIO_PRODUCTO, 0) AS total FROM producto p LEFT JOIN detalle_fac df ON p.ID_PRODUCTO = df.ID_PRODUCTO GROUP BY p.ID_PRODUCTO;"
      );

      res.status(200).json({
        message: "products found",
        productos: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "products couldn't be found",
        data: error.message,
      });
    }
  },
};
