const express = require("express");
const {
    createRestaurant,
    listRestaurants,
    getRestaurantById,
    setRestaurantStatus,
    resetRestaurantAdminPassword,
} = require("../controllers/restaurantController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { checkRole } = require("../middlewares/verifyRole");
const { ROLES } = require("../constants/roles");

const router = express.Router();

// Platform routes — Super Admin only. Manages restaurants and their admins.
router.use(isVerifiedUser, checkRole([ROLES.SUPER_ADMIN]));

router.route("/restaurants")
    .get(listRestaurants)
    .post(createRestaurant);

router.get("/restaurants/:id", getRestaurantById);
router.patch("/restaurants/:id/status", setRestaurantStatus);
router.post("/restaurants/:id/reset-admin-password", resetRestaurantAdminPassword);

module.exports = router;
