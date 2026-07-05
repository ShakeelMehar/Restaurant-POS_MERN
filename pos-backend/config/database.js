const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.databaseURI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        global.dbConnected = true;
    } catch (error) {
        console.log(`❌ Database connection failed: ${error.message}`);
        console.log(`⚠️  Running backend in OFFLINE/MOCK mode!`);
        global.dbConnected = false;
    }
}

module.exports = connectDB;