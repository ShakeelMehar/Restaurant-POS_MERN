const express = require("express");
const { createRestaurant } = require("../controllers/restaurantController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { checkRole } = require("../middlewares/verifyRole");
const { ROLES } = require("../constants/roles");

const router = express.Router();

// POST /api/admin/restaurants — Super Admin only
router.post("/restaurants", isVerifiedUser, checkRole([ROLES.SUPER_ADMIN]), createRestaurant);

module.exports = router;
