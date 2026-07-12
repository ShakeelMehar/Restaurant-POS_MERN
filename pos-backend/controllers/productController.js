const createHttpError = require("http-errors");
const Product = require("../models/productModel");

const createProduct = async (req, res, next) => {
    try {
        const { name, category, description, price, optionGroups, hasPortions, portions } = req.body;
        if (!name || !category || price == null) {
            return next(createHttpError(400, "Name, category, and price are required"));
        }

        const product = await Product.create({ name, category, description, price, optionGroups, hasPortions, portions });
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().populate("category", "name order").sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("category", "name");
        if (!product) return next(createHttpError(404, "Product not found"));
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return next(createHttpError(404, "Product not found"));
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports = { createProduct, getProducts, updateProduct, deleteProduct };
