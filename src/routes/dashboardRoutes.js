const router = require("express").Router();
const ctrl = require("../controllers/dashboardController");
const auth = require("../middlewares/authMiddleware");

router.use(auth);

router.get("/", ctrl.getDashboard);   // RF11 / RF12

module.exports = router;
