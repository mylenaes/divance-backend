require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes        = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes   = require("./routes/dashboardRoutes");
const categoryRoutes    = require("./routes/categoryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ─── Rotas ───────────────────────────────────────────────────────────────────
app.use("/auth",         authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/dashboard",    dashboardRoutes);
app.use("/categories",   categoryRoutes);

// ─── Health check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "API Divance a funcionar 🚀" });
});

module.exports = app;
