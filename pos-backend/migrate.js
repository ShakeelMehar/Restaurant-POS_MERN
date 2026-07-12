const mongoose = require("mongoose");
require("dotenv").config(); // Assuming you have .env

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("Connected to MongoDB for migration");
    
    try {
        const Restaurant = require("./models/restaurantModel");
        const User = require("./models/userModel");
        const Product = require("./models/productModel");
        const Category = require("./models/categoryModel");
        const Order = require("./models/orderModel");
        const Payment = require("./models/paymentModel");
        const Settings = require("./models/settingsModel");

        // 1. Create Legacy Restaurant if it doesn't exist
        let legacyRestaurant = await Restaurant.findOne({ name: "Legacy Restaurant" });
        if (!legacyRestaurant) {
            legacyRestaurant = await Restaurant.create({
                name: "Legacy Restaurant",
                address: "Legacy Address",
                contactNumber: "0000000000",
                email: "legacy@restro.com",
                isActive: true
            });
            console.log("Created Legacy Restaurant with ID:", legacyRestaurant._id);
        } else {
            console.log("Legacy Restaurant already exists with ID:", legacyRestaurant._id);
        }

        const restaurantId = legacyRestaurant._id;

        // 2. Update all Users without a restaurantId
        // Bypassing our tenant isolation plugin because we are running a raw script without tenantContext
        // Wait, the plugin runs on 'find', 'updateMany', etc. 
        // We must wrap our migration script in tenantContext with bypassIsolation: true!
        const tenantContext = require("./middlewares/tenantContext");
        
        await tenantContext.run({ bypassIsolation: true }, async () => {
            const userResult = await User.updateMany({ restaurantId: { $exists: false } }, { $set: { restaurantId } });
            console.log(`Updated ${userResult.modifiedCount} users.`);

            const productResult = await Product.updateMany({ restaurantId: { $exists: false } }, { $set: { restaurantId } });
            console.log(`Updated ${productResult.modifiedCount} products.`);

            const categoryResult = await Category.updateMany({ restaurantId: { $exists: false } }, { $set: { restaurantId } });
            console.log(`Updated ${categoryResult.modifiedCount} categories.`);

            const orderResult = await Order.updateMany({ restaurantId: { $exists: false } }, { $set: { restaurantId } });
            console.log(`Updated ${orderResult.modifiedCount} orders.`);

            const paymentResult = await Payment.updateMany({ restaurantId: { $exists: false } }, { $set: { restaurantId } });
            console.log(`Updated ${paymentResult.modifiedCount} payments.`);

            const settingsResult = await Settings.updateMany({ restaurantId: { $exists: false } }, { $set: { restaurantId } });
            console.log(`Updated ${settingsResult.modifiedCount} settings.`);
        });

        console.log("Migration complete!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
});
