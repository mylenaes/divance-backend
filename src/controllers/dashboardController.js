const pool = require("../database/connection");

exports.getDashboard = async (req, res) => {
  const userId = req.userId;

  try {
    // RN01, RN02, RN03 — saldo = receitas - despesas
    const totais = await pool.query(
      `SELECT
         COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END), 0) AS total_receitas,
         COALESCE(SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END), 0) AS total_despesas
       FROM transacao
       WHERE usuario_id = $1`,
      [userId]
    );

    const ultimas = await pool.query(
      `SELECT t.id,
              t.descricao,
              t.valor,
              t.tipo,
              t.data,
              c.nome AS categoria
       FROM transacao t
       JOIN categoria c ON c.id = t.categoria_id
       WHERE t.usuario_id = $1
       ORDER BY t.data DESC, t.criado_em DESC
       LIMIT 5`,
      [userId]
    );

    const categorias = await pool.query(
      `SELECT c.nome,
              COALESCE(SUM(t.valor), 0) AS total
       FROM transacao t
       JOIN categoria c ON c.id = t.categoria_id
       WHERE t.usuario_id = $1 AND t.tipo = 'despesa'
       GROUP BY c.nome
       ORDER BY total DESC`,
      [userId]
    );

    const totalReceitas = Number(totais.rows[0].total_receitas);
    const totalDespesas = Number(totais.rows[0].total_despesas);

    res.json({
      saldo: totalReceitas - totalDespesas,            // RN01
      totalReceitas,                                    // RN02
      totalDespesas,                                    // RN03
      ultimasTransacoes: ultimas.rows,
      gastosPorCategoria: categorias.rows,              // RN04
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
