const createHttpError = require("http-errors");
const crypto = require("node:crypto");
const Restaurant = require("../models/restaurantModel");
const User = require("../models/userModel");
const tenantContext = require("../middlewares/tenantContext");
const { ROLES } = require("../constants/roles");

const createRestaurant = async (req, res, next) => {
    try {
        const { restaurantName, address, phone, taxId, adminName, adminEmail, adminPhone } = req.body;

        if (!restaurantName || !adminName || !adminEmail || !adminPhone) {
            return next(createHttpError(400, "restaurantName, adminName, adminEmail, and adminPhone are required."));
        }

        // 1. Check email is globally unique (bypass tenant isolation)
        let isEmailTaken;
        await tenantContext.run({ bypassIsolation: true }, async () => {
            isEmailTaken = await User.findOne({ email: adminEmail, isDeleted: { $ne: true } });
        });
        if (isEmailTaken) {
            return next(createHttpError(400, "Email is already in use by another user."));
        }

        // 2. Create the Restaurant document (no tenant isolation needed — Restaurant is the root entity)
        const restaurant = await Restaurant.create({
            name: restaurantName,
            address: address || "",
            phone: phone || "",
            taxId: taxId || "",
            isActive: true,
        });

        // 3. Generate a cryptographically random temporary password and hash it via the pre-save hook
        const tempPassword = crypto.randomBytes(12).toString("hex"); // 24-char hex string

        // 4. Create the initial Restaurant Admin user, bound to the new restaurant
        let newAdmin;
        await tenantContext.run({ restaurantId: restaurant._id, bypassIsolation: false }, async () => {
            newAdmin = new User({
                name: adminName,
                email: adminEmail,
                phone: adminPhone,
                password: tempPassword, // Will be hashed by pre-save hook
                role: ROLES.ADMIN,
                restaurantId: restaurant._id,
                forcePasswordChange: true, // Force password reset on first login
            });
            await newAdmin.save();
        });

        // 5. Return temp password ONCE in the response — it is never stored in plain text
        res.status(201).json({
            success: true,
            message: "Restaurant and admin account created successfully.",
            data: {
                restaurant: {
                    _id: restaurant._id,
                    name: restaurant.name,
                },
                admin: {
                    _id: newAdmin._id,
                    name: newAdmin.name,
                    email: newAdmin.email,
                    role: newAdmin.role,
                    forcePasswordChange: newAdmin.forcePasswordChange,
                },
                // ⚠️ This is the only time this password is returned in plain text.
                // Share it securely with the Restaurant Admin and instruct them to change it on first login.
                temporaryPassword: tempPassword,
            },
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/restaurants — Super Admin: list every restaurant with its admin(s) and cashier count.
const listRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find({}).sort({ createdAt: -1 }).lean();

        // Super Admin context has bypassIsolation=true, so this User query spans all tenants.
        const users = await User.find({ isDeleted: { $ne: true } })
            .select("name email role restaurantId")
            .lean();

        const byRestaurant = {};
        for (const u of users) {
            const key = String(u.restaurantId);
            if (!byRestaurant[key]) byRestaurant[key] = { admins: [], cashierCount: 0 };
            if (u.role === ROLES.ADMIN) byRestaurant[key].admins.push({ _id: u._id, name: u.name, email: u.email });
            else if (u.role === ROLES.CASHIER) byRestaurant[key].cashierCount += 1;
        }

        const data = restaurants.map((r) => ({
            ...r,
            admins: byRestaurant[String(r._id)]?.admins || [],
            cashierCount: byRestaurant[String(r._id)]?.cashierCount || 0,
        }));

        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/restaurants/:id — Super Admin: one restaurant with its admins and cashier count.
const getRestaurantById = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).lean();
        if (!restaurant) return next(createHttpError(404, "Restaurant not found."));

        const users = await User.find({ restaurantId: restaurant._id, isDeleted: { $ne: true } })
            .select("name email role phone")
            .lean();

        const admins = users.filter((u) => u.role === ROLES.ADMIN);
        const cashierCount = users.filter((u) => u.role === ROLES.CASHIER).length;

        res.status(200).json({ success: true, data: { ...restaurant, admins, cashierCount } });
    } catch (error) {
        next(error);
    }
};

// PATCH /api/admin/restaurants/:id/status — Super Admin: activate/deactivate a restaurant.
// A deactivated restaurant's users are blocked from logging in (see userController.login).
const setRestaurantStatus = async (req, res, next) => {
    try {
        const { isActive } = req.body;
        if (typeof isActive !== "boolean") {
            return next(createHttpError(400, "isActive (boolean) is required."));
        }

        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true }
        ).lean();
        if (!restaurant) return next(createHttpError(404, "Restaurant not found."));

        res.status(200).json({
            success: true,
            message: `Restaurant ${isActive ? "activated" : "deactivated"} successfully.`,
            data: { _id: restaurant._id, name: restaurant.name, isActive: restaurant.isActive },
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/admin/restaurants/:id/reset-admin-password — Super Admin: reset a restaurant admin's password.
// Returns a new temporary password ONCE; the admin is forced to change it on next login.
const resetRestaurantAdminPassword = async (req, res, next) => {
    try {
        const { adminId } = req.body;
        if (!adminId) return next(createHttpError(400, "adminId is required."));

        const admin = await User.findOne({
            _id: adminId,
            restaurantId: req.params.id,
            role: ROLES.ADMIN,
            isDeleted: { $ne: true },
        });
        if (!admin) return next(createHttpError(404, "Admin not found for this restaurant."));

        const tempPassword = crypto.randomBytes(12).toString("hex");
        admin.password = tempPassword; // hashed by the pre-save hook
        admin.forcePasswordChange = true;
        await admin.save();

        res.status(200).json({
            success: true,
            message: "Admin password reset successfully.",
            data: {
                adminId: admin._id,
                email: admin.email,
                // ⚠️ Only time this password is shown in plain text — share it securely.
                temporaryPassword: tempPassword,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRestaurant,
    listRestaurants,
    getRestaurantById,
    setRestaurantStatus,
    resetRestaurantAdminPassword,
};
