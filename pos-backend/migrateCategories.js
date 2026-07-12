/**
 * migrateCategories.js
 *
 * Migrates Product documents whose `category` field is a plain string
 * (e.g. "Special Pizzas") to the correct Category ObjectId reference.
 *
 * Usage:
 *   node pos-backend/migrateCategories.js            <- writes to DB
 *   node pos-backend/migrateCategories.js --dry-run  <- prints what would change, no writes
 */

const mongoose = require("mongoose");
require("dotenv").config();
const tenantContext = require("./middlewares/tenantContext");

const DRY_RUN = process.argv.includes("--dry-run");

if (DRY_RUN) {
    console.log("🔍 DRY-RUN MODE — No database writes will occur.\n");
}

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("✅ Connected to MongoDB for category migration\n");

    try {
        const Product = require("./models/productModel");
        const Category = require("./models/categoryModel");

        await tenantContext.run({ bypassIsolation: true }, async () => {
            // Fetch raw documents via native collection to bypass Mongoose schema casting.
            // This ensures we see the actual stored value of `category` (string or ObjectId),
            // not the schema-coerced version.
            const rawProducts = await Product.collection.find({}).toArray();
            const categories = await Category.find({});

            const categoryByName = new Map(
                categories.map(c => [c.name.trim().toLowerCase(), c])
            );

            let migratedCount = 0;
            let skippedCount = 0;
            let orphanCount = 0;

            for (const product of rawProducts) {
                const catField = product.category;

                // Skip products already storing an ObjectId (migration already done)
                if (catField && mongoose.Types.ObjectId.isValid(catField) && typeof catField !== 'string') {
                    console.log(`  ⏩ SKIP: "${product.name}" — category is already an ObjectId.`);
                    skippedCount++;
                    continue;
                }

                if (catField && typeof catField === 'string' && mongoose.Types.ObjectId.isValid(catField)) {
                    // It's a string that happens to look like an ObjectId — confirm it resolves
                    const exists = categories.some(c => c._id.toString() === catField);
                    if (exists) {
                        console.log(`  ⏩ SKIP: "${product.name}" — category string is already a valid ObjectId reference.`);
                        skippedCount++;
                        continue;
                    }
                }

                const catName = typeof catField === 'string' ? catField.trim() : null;
                if (!catName) {
                    console.log(`  ⚠️ SKIP: "${product.name}" — category field is empty or invalid.`);
                    skippedCount++;
                    continue;
                }

                let matchedCategory = categoryByName.get(catName.toLowerCase());

                if (!matchedCategory) {
                    // Create a new Category document on the fly for this restaurant
                    if (DRY_RUN) {
                        console.log(`  🆕 DRY-RUN: Would CREATE new Category "${catName}" for restaurantId "${product.restaurantId}" and update product "${product.name}".`);
                    } else {
                        console.log(`  🆕 Creating missing Category "${catName}" for restaurantId "${product.restaurantId}"...`);
                        matchedCategory = await Category.create({
                            name: catName,
                            restaurantId: product.restaurantId,
                        });
                        categoryByName.set(catName.toLowerCase(), matchedCategory);
                        console.log(`     ✅ Created Category with ID: ${matchedCategory._id}`);
                    }
                    orphanCount++;
                }

                if (DRY_RUN) {
                    console.log(`  📝 DRY-RUN: Would UPDATE product "${product.name}" → category: "${catName}" → ObjectId(${matchedCategory?._id || "NEW_ID"})`);
                } else {
                    await Product.collection.updateOne(
                        { _id: product._id },
                        { $set: { category: matchedCategory._id } }
                    );
                    console.log(`  ✅ MIGRATED: "${product.name}" → category ObjectId: ${matchedCategory._id}`);
                }

                migratedCount++;
            }

            console.log(`\n--- Migration Summary ---`);
            console.log(`  Products migrated : ${migratedCount}`);
            console.log(`  Products skipped  : ${skippedCount}`);
            console.log(`  Orphan categories created : ${orphanCount}`);
            if (DRY_RUN) {
                console.log(`\n  ⚠️  DRY-RUN complete. Run without --dry-run to apply changes.`);
            } else {
                console.log(`\n  🎉 Migration complete!`);
            }
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
});
