require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/categoryModel");
const Product = require("./models/productModel");
const Restaurant = require("./models/restaurantModel");
const tenantContext = require("./middlewares/tenantContext");

const biryaniCategory = {
    name: "Biryani",
    icon: "🍛",
    bgColor: "#ff385c"
};

const biryaniDishes = [
    { name: "Half Sada Biryani", price: 200 },
    { name: "Full Sada Biryani", price: 350 },
    { name: "Half Chicken Biryani", price: 300 },
    { name: "Full Chicken Biryani", price: 500 },
    { name: "Double Chicken Biryani", price: 650 },
    { name: "Student Biryani", price: 250 },
    { name: "Friends Biryani", price: 1200 }
];

const drinksCategory = {
    name: "Drinks",
    icon: "🥤",
    bgColor: "#008489"
};

const drinksItems = ["7up", "Pepsi", "Coca Cola", "Next Cola", "Sprite", "Sting"];

const drinksPortions = {
    quarter: 80, // Regular
    half: 120, // Half Liter
    large: 200 // 1 Liter
};

const extraCategory = {
    name: "Extra",
    icon: "🥗",
    bgColor: "#7ed321"
};

const extraDishes = [
    { name: "Rice 100", price: 100 },
    { name: "Rice 200", price: 200 },
    { name: "Shami Tikki", price: 60 },
    { name: "Raita", price: 50 },
    { name: "Salad", price: 50 }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB.");

        const restaurant = await tenantContext.run({ bypassIsolation: true }, async () => {
            return await Restaurant.findOne();
        });

        if (!restaurant) {
            console.error("No restaurant found in DB. Cannot seed data.");
            process.exit(1);
        }

        console.log(`Seeding for restaurant: ${restaurant.name}`);

        await tenantContext.run({ restaurantId: restaurant._id }, async () => {
            // Helper function to get or create a category
            async function getOrCreateCategory(catData) {
                let cat = await Category.findOne({ name: catData.name });
                if (!cat) {
                    cat = await Category.create(catData);
                }
                return cat;
            }

            // Biryani
            console.log("Adding Biryani category...");
            const biryaniCat = await getOrCreateCategory(biryaniCategory);
            for (let dish of biryaniDishes) {
                const exists = await Product.findOne({ name: dish.name, category: biryaniCat._id });
                if (!exists) {
                    await Product.create({
                        name: dish.name,
                        category: biryaniCat._id,
                        price: dish.price,
                        hasPortions: false
                    });
                }
            }

            // Drinks
            console.log("Adding Drinks category...");
            const drinksCat = await getOrCreateCategory(drinksCategory);
            for (let item of drinksItems) {
                const exists = await Product.findOne({ name: item, category: drinksCat._id });
                if (!exists) {
                    await Product.create({
                        name: item,
                        category: drinksCat._id,
                        price: drinksPortions.quarter, // base price
                        hasPortions: true,
                        portions: drinksPortions
                    });
                }
            }

            // Extra
            console.log("Adding Extra category...");
            const extraCat = await getOrCreateCategory(extraCategory);
            for (let dish of extraDishes) {
                const exists = await Product.findOne({ name: dish.name, category: extraCat._id });
                if (!exists) {
                    await Product.create({
                        name: dish.name,
                        category: extraCat._id,
                        price: dish.price,
                        hasPortions: false
                    });
                }
            }

            console.log("Seeding complete!");
        });

        mongoose.connection.close();
    } catch (error) {
        console.error("Seeding error:", error);
        mongoose.connection.close();
    }
}

seed();
