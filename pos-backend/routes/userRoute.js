const express = require("express");
const { createCashier, login, getUserData, logout, changePassword, getAllStaff, deleteStaff, updateStaffPassword, updateStaff } = require("../controllers/userController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { checkRole } = require("../middlewares/verifyRole");
const validateRequest = require("../middlewares/validateRequest");
const { createCashierSchema, loginSchema, changePasswordSchema, updateStaffSchema, updateStaffPasswordSchema } = require("../validations/userValidation");
const { ROLES } = require("../constants/roles");

const router = express.Router();

// Authentication Routes
router.route("/login").post(validateRequest(loginSchema), login);
router.route("/logout").post(isVerifiedUser, logout);
router.route("/change-password").put(isVerifiedUser, validateRequest(changePasswordSchema), changePassword);
router.route("/").get(isVerifiedUser, getUserData);

// Admin-only Staff Management Routes (cashiers only — role is assigned server-side)
router.route("/staff")
    .get(isVerifiedUser, checkRole([ROLES.ADMIN]), getAllStaff)
    .post(isVerifiedUser, checkRole([ROLES.ADMIN]), validateRequest(createCashierSchema), createCashier);
router.route("/staff/:id")
    .put(isVerifiedUser, checkRole([ROLES.ADMIN]), validateRequest(updateStaffSchema), updateStaff)
    .delete(isVerifiedUser, checkRole([ROLES.ADMIN]), deleteStaff);
router.put("/staff/:id/password", isVerifiedUser, checkRole([ROLES.ADMIN]), validateRequest(updateStaffPasswordSchema), updateStaffPassword);

module.exports = router;