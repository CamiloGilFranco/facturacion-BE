const { pool } = require("../../config/database");

module.exports = {
  async createClient(req, res) {
    try {
      const { NOMBRE_CLIENTE, DIRECCIO_CLIENTE, TELEFON_CLIENTE } = req.body;

      const [result] = await pool.query(
        "INSERT INTO cliente (NOMBRE_CLIENTE, DIRECCIO_CLIENTE,TELEFON_CLIENTE) VALUES (?, ?, ?)",
        [NOMBRE_CLIENTE, DIRECCIO_CLIENTE, TELEFON_CLIENTE]
      );

      console.log(result);

      res.status(200).json({
        message: "client created",
        product: {
          id: result.insertId,
          NOMBRE_CLIENTE,
          DIRECCIO_CLIENTE,
          TELEFON_CLIENTE,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "client couldn't be created",
        data: error.message,
      });
    }
  },

  async findAllClients(req, res) {
    try {
      const [result] = await pool.query("SELECT * FROM cliente");

      res.status(200).json({
        message: "clients found",
        clientes: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "clients couldn't be found",
        data: error.message,
      });
    }
  },

  async findOneCLient(req, res) {
    try {
      const { id } = req.params;

      const [result] = await pool.query(
        "SELECT * FROM client WHERE ID_CLIENTE = ?",
        id
      );

      if (result.length === 0) {
        res.status(404).json({
          message: "client not found",
        });
        return;
      }

      res.status(200).json({
        message: "client found",
        client: result[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "client couldn't be found",
        data: error.message,
      });
    }
  },

  async updateClient(req, res) {
    try {
      await pool.query("UPDATE cliente SET ? WHERE ID_CLIENTE = ?", [
        req.body,
        req.params.id,
      ]);

      const [result] = await pool.query(
        "SELECT * FROM cliente WHERE ID_CLIENTE = ?",
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

  async deleteClient(req, res) {
    try {
      const { id } = req.body;

      const [result] = await pool.query(
        "DELETE FROM cliente WHERE ID_CLIENTE = ?",
        id
      );

      if (result.affectedRows === 0) {
        res.status(404).json({
          message: "client not found",
        });
        return;
      }

      res.status(204).json({
        message: "client deleted",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "client couldn't be deleted",
        data: error.message,
      });
    }
  },
};
