const Settings = require("../models/settingsModel");
const createHttpError = require("http-errors");

const getSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();
        
        // If no settings exist yet, create default
        if (!settings) {
            settings = await Settings.create({});
        }
        
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        next(error);
    }
};

const updateSettings = async (req, res, next) => {
    try {
        const { restaurantName, location, branch, contactNumber, logoUrl } = req.body;
        
        const settings = await Settings.findOneAndUpdate(
            {}, 
            { restaurantName, location, branch, contactNumber, logoUrl },
            { new: true, upsert: true, runValidators: true }
        );
        
        res.status(200).json({ success: true, message: "Settings updated successfully", data: settings });
    } catch (error) {
        next(error);
    }
};

module.exports = { getSettings, updateSettings };
