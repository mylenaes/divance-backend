const router = require("express").Router();
const auth = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rotas públicas
router.post("/register", auth.register);       // RF01
router.post("/login", auth.login);             // RF02
router.post("/recover-password", auth.recoverPassword); // RF04

// Rota protegida — exige token válido
router.post("/logout", authMiddleware, auth.logout);    // RF03

module.exports = router;