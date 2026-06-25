const pool = require("../database/connection");

exports.create = async (req, res) => {
  const { descricao, valor, tipo, data, categoria_id } = req.body;

  if (!descricao || !valor || !tipo || !data || !categoria_id) {
    return res.status(400).json({
      message: "Descrição, valor, tipo, data e categoria são obrigatórios",
    });
  }

  if (!["receita", "despesa"].includes(tipo)) {
    return res.status(400).json({
      message: "Tipo deve ser 'receita' ou 'despesa'",
    });
  }

  if (Number(valor) <= 0) {
    return res.status(400).json({
      message: "Valor deve ser positivo",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO transacao 
        (descricao, valor, tipo, data, usuario_id, categoria_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [descricao, valor, tipo, data, req.userId, categoria_id]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          t.id,
          t.descricao,
          t.valor,
          t.tipo,
          t.data,
          t.criado_em,
          t.atualizado_em,
          c.id AS categoria_id,
          c.nome AS categoria
       FROM transacao t
       JOIN categoria c ON c.id = t.categoria_id
       WHERE t.usuario_id = $1
       ORDER BY t.data DESC, t.criado_em DESC`,
      [req.userId]
    );

    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, tipo, data, categoria_id } = req.body;

  if (!descricao || !valor || !tipo || !data || !categoria_id) {
    return res.status(400).json({
      message: "Descrição, valor, tipo, data e categoria são obrigatórios",
    });
  }

  if (!["receita", "despesa"].includes(tipo)) {
    return res.status(400).json({
      message: "Tipo deve ser 'receita' ou 'despesa'",
    });
  }

  if (Number(valor) <= 0) {
    return res.status(400).json({
      message: "Valor deve ser positivo",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE transacao
       SET descricao = $1,
           valor = $2,
           tipo = $3,
           data = $4,
           categoria_id = $5,
           atualizado_em = NOW()
       WHERE id = $6 AND usuario_id = $7
       RETURNING *`,
      [descricao, valor, tipo, data, categoria_id, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transação não encontrada" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM transacao WHERE id = $1 AND usuario_id = $2 RETURNING id",
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transação não encontrada" });
    }

    return res.json({ message: "Transação removida com sucesso" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};