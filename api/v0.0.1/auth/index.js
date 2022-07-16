const router = require("express").Router();

router.use("/login", require("./login"));
router.use("/auth", require("./auth"));
// router.post("/register", require("./register"));

module.exports = router;
