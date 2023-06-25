const express = require("express");
const router = new express.Router();
const SenderMasksController = require("../controllers/SenderMasksController");
const Auth = require("../lib/validations/authentication-middleware");

router.get("/", Auth.isAuthenticated, SenderMasksController.getAllSenderMasks);

router.post(
  "/create",
  Auth.isAuthenticated,
  SenderMasksController.createSenderMasks
);

router.put(
  "/:id/update",
  Auth.isAuthenticated,
  SenderMasksController.updateSenderMasks
);

router.delete(
  "/:id",
  Auth.isAuthenticated,
  SenderMasksController.deleteSenderMasks
);

module.exports = router;
