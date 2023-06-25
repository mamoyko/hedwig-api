const express = require("express");
const path = require("path");
const router = new express.Router();
const BlastController = require("../controllers/BlastController");
const { BlastValidation } = require("../lib/validations/blast-validation");
const Auth = require("../lib/validations/authentication-middleware");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../tmp/csv"));
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/details/:blastId", Auth.isAuthenticated, BlastController.getBlast);

router.get("/list", Auth.isAuthenticated, BlastController.getActivityList);

router.post(
  "/",
  Auth.isAuthenticated,
  upload.single("file"),
  BlastValidation.create(),
  BlastController.createBlast
);

router.get(
  "/:blastId/download",
  Auth.isAuthenticated,
  BlastController.downloadFile
);

router.get("/audit-trail", BlastController.auditTrail);

module.exports = router;
