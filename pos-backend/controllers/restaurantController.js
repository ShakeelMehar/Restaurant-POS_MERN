const createHttpError = require("http-errors");
const crypto = require("node:crypto");
const Restaurant = require("../models/restaurantModel");
const User = require("../models/userModel");
const tenantContext = require("../middlewares/tenantContext");

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
                role: "admin",
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

module.exports = { createRestaurant };
