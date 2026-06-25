const router = require("express").Router();
const ctrl = require("../controllers/categoryController");
const auth = require("../middlewares/authMiddleware");

router.use(auth);

router.get("/", ctrl.getAll);   // RF10

module.exports = router;
