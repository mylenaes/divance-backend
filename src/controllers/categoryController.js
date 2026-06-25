const pool = require("../database/connection");


exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nome FROM categoria ORDER BY nome ASC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
