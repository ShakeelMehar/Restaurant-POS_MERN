const express = require("express");
const { getReports } = require("../controllers/reportController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { checkRole } = require("../middlewares/verifyRole");

const router = express.Router();

router.route("/")
    .get(isVerifiedUser, checkRole(["admin"]), getReports);

module.exports = router;
