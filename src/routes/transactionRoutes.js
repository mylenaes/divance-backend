const router = require("express").Router();
const ctrl = require("../controllers/transactionController");
const auth = require("../middlewares/authMiddleware");

// Todas as rotas de transações exigem autenticação
router.use(auth);

router.post("/", ctrl.create);
router.get("/", ctrl.getAll);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
