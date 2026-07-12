const express = require("express");
const { createRestaurant } = require("../controllers/restaurantController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { checkRole } = require("../middlewares/verifyRole");

const router = express.Router();

// POST /api/admin/restaurants — Super Admin only
router.post("/restaurants", isVerifiedUser, checkRole(["super admin"]), createRestaurant);

module.exports = router;
