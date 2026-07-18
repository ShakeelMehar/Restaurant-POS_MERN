require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel");
const tenantContext = require("../middlewares/tenantContext");
const { ROLES, ROLE_VALUES } = require("../constants/roles");

// One-time migration: normalize any legacy role casing/spacing to the canonical machine values.
// Run this BEFORE relying on the schema `enum`, otherwise legacy docs fail validation on next save.
//
// Usage:  node migrations/normalize_roles.js
//
// Maps any case/spacing variant of the three known roles -> canonical value.
function canonicalizeRole(raw) {
    if (typeof raw !== "string") return null;
    const key = raw.trim().toLowerCase().replace(/[\s-]+/g, "_"); // "Super Admin" / "super admin" -> "super_admin"
    return ROLE_VALUES.includes(key) ? key : null;
}

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB.");

        // Operate across all tenants — this is a platform-wide data fix.
        await tenantContext.run({ bypassIsolation: true }, async () => {
            const users = await User.find({});
            console.log(`Scanning ${users.length} users...`);

            let updated = 0;
            const unmapped = [];

            for (const user of users) {
                const canonical = canonicalizeRole(user.role);
                if (!canonical) {
                    unmapped.push({ id: user._id.toString(), role: user.role });
                    continue;
                }
                if (user.role !== canonical) {
                    // Update directly to avoid re-triggering unrelated validation/hooks.
                    await User.updateOne({ _id: user._id }, { $set: { role: canonical } });
                    console.log(`  ${user.email}: "${user.role}" -> "${canonical}"`);
                    updated++;
                }
            }

            console.log(`\nDone. ${updated} user(s) normalized.`);
            if (unmapped.length) {
                console.warn(`\n⚠️  ${unmapped.length} user(s) had an unrecognized role — resolve manually:`);
                unmapped.forEach((u) => console.warn(`   id=${u.id} role=${JSON.stringify(u.role)}`));
            }
        });
    } catch (error) {
        console.error("Migration error:", error);
    } finally {
        await mongoose.connection.close();
    }
}

migrate();
