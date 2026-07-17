const createHttpError = require("http-errors");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

const createProduct = async (req, res, next) => {
    try {
        const { name, category, description, price, optionGroups, hasPortions, portions } = req.body;
        if (!name || !category || price == null) {
            return next(createHttpError(400, "Name, category, and price are required"));
        }

        // Validate that category exists and belongs to the active tenant restaurant
        const targetCategory = await Category.findById(category);
        if (!targetCategory) {
            return next(createHttpError(400, "Category not found or does not belong to this restaurant."));
        }

        const product = await Product.create({ name, category, description, price, optionGroups, hasPortions, portions });
        // Populate after creation to return full category object
        await product.populate("category", "name bgColor icon order");
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {
    try {
        const { page, limit } = req.query;

        if (page || limit) {
            const pageNum = Math.max(1, parseInt(page) || 1);
            const limitNum = Math.max(1, parseInt(limit) || 20);
            const skip = (pageNum - 1) * limitNum;

            const total = await Product.countDocuments();
            const products = await Product.find()
                .populate("category", "name bgColor icon order")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum);

            return res.status(200).json({
                success: true,
                data: products,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    pages: Math.ceil(total / limitNum)
                }
            });
        }

        const products = await Product.find()
            .populate("category", "name bgColor icon order")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { category } = req.body;
        
        // Validate category if it is being updated
        if (category) {
            const targetCategory = await Category.findById(category);
            if (!targetCategory) {
                return next(createHttpError(400, "Category not found or does not belong to this restaurant."));
            }
        }

        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .populate("category", "name bgColor icon order");
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
