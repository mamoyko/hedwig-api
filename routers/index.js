const express = require("express");
const router = new express.Router();

const userRoutes = require("./user");
const senderMasksRoutes = require("./sender-masks");
const blastRoutes = require("./blast");

router.use("/api/user", userRoutes);
router.use("/api/sendermasks", senderMasksRoutes);
router.use("/api/blasts", blastRoutes);

module.exports = router;
