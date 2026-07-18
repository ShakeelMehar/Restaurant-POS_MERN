require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/userModel");
const tenantContext = require("./middlewares/tenantContext");
const { ROLES } = require("./constants/roles");

// One-off bootstrap for the single platform Super Admin.
// There is intentionally NO HTTP route that creates a super admin — provisioning happens here only.
//
// Usage (PowerShell):
//   $env:SUPERADMIN_NAME="Site Owner"; $env:SUPERADMIN_EMAIL="owner@example.com"; `
//   $env:SUPERADMIN_PHONE="03001234567"; $env:SUPERADMIN_PASSWORD="change-me-now"; `
//   node seed_superadmin.js
async function seedSuperAdmin() {
    const {
        SUPERADMIN_NAME: name,
        SUPERADMIN_EMAIL: email,
        SUPERADMIN_PHONE: phone,
        SUPERADMIN_PASSWORD: password,
    } = process.env;

    if (!name || !email || !phone || !password) {
        console.error(
            "Missing env vars. Required: SUPERADMIN_NAME, SUPERADMIN_EMAIL, SUPERADMIN_PHONE, SUPERADMIN_PASSWORD"
        );
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB.");

        // Super Admin has no tenant, so every query/write must bypass tenant isolation.
        await tenantContext.run({ bypassIsolation: true }, async () => {
            const existing = await User.findOne({ email });
            if (existing) {
                console.error(`A user with email ${email} already exists. Aborting.`);
                process.exit(1);
            }

            const superAdmin = new User({
                name,
                email,
                phone,
                password, // hashed by the pre-save hook
                role: ROLES.SUPER_ADMIN,
                forcePasswordChange: true,
            });
            await superAdmin.save();
            console.log(`Super Admin created: ${superAdmin.email} (id: ${superAdmin._id})`);
        });
    } catch (error) {
        console.error("Super Admin seeding error:", error);
    } finally {
        await mongoose.connection.close();
    }
}

seedSuperAdmin();
