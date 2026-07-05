const express = require("express");
const { addTable, getTables, updateTable } = require("../controllers/tableController");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification")
const { checkRole } = require("../middlewares/verifyRole");
 
router.route("/").post(isVerifiedUser, checkRole(["Admin", "Super Admin"]), addTable);
router.route("/").get(isVerifiedUser, getTables);
router.route("/:id").put(isVerifiedUser, checkRole(["Admin", "Super Admin"]), updateTable);

module.exports = router;