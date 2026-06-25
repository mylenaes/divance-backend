const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/connection");

exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: "Nome, e-mail e senha são obrigatórios" });
  }

  try {
    const userExists = await pool.query(
      "SELECT id FROM usuario WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "E-mail já cadastrado" });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      "INSERT INTO usuario (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email",
      [nome, email, senha_hash]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
  }

  try {
    const user = await pool.query(
      "SELECT * FROM usuario WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const valid = await bcrypt.compare(senha, user.rows[0].senha_hash);

    if (!valid) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      usuario: {
        id: user.rows[0].id,
        nome: user.rows[0].nome,
        email: user.rows[0].email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.logout = (req, res) => {
  res.json({ message: "Logout realizado com sucesso" });
};


exports.recoverPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "E-mail é obrigatório" });
  }

  try {
    const user = await pool.query(
      "SELECT id FROM usuario WHERE email = $1",
      [email]
    );

    res.json({
      message: "Você receberá as instruções de recuperação.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
