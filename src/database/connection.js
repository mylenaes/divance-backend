const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("❌ Erro no banco:", err.message);
  } else {
    console.log("✅ Banco conectado com sucesso!");
  }
});

module.exports = pool;