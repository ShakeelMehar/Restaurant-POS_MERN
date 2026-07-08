const createHttpError = require("http-errors");
const Category = require("../models/categoryModel");

const createCategory = async (req, res, next) => {
    try {
        const { name, bgColor, icon, order } = req.body;
        if (!name) return next(createHttpError(400, "Category name is required"));

        const category = await Category.create({ name, bgColor, icon, order });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ order: 1 });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!category) return next(createHttpError(404, "Category not found"));
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return next(createHttpError(404, "Category not found"));
        res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
