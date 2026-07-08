const express = require("express");
const { getSettings, updateSettings } = require("../controllers/settingsController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { checkRole } = require("../middlewares/verifyRole");

const router = express.Router();

router.route("/")
    .get(getSettings)
    .put(isVerifiedUser, checkRole(["admin"]), updateSettings);

module.exports = router;
