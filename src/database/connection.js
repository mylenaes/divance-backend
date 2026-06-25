const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
}); ///Usar quando for pra produção, pois o railway exige ssl

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

require("dotenv").config();

//console.log("DATABASE_URL =", process.env.DATABASE_URL);

module.exports = pool;

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("❌ Erro no banco:", err.message);
  } else {
    console.log("✅ Banco conectado com sucesso!");
  }
});