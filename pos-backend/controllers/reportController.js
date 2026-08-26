const createHttpError = require("http-errors");
const Order = require("../models/orderModel");

const getReports = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        let matchStage = {};
        
        if (startDate && endDate) {
            matchStage.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Total Sales
        const totalSales = await Order.aggregate([
            { $match: matchStage },
            { $group: { _id: null, total: { $sum: "$bills.totalWithTax" }, count: { $sum: 1 } } }
        ]);

        // Payment Method Breakdown
        const paymentMethods = await Order.aggregate([
            { $match: matchStage },
            { $group: { _id: "$paymentMethod", total: { $sum: "$bills.totalWithTax" }, count: { $sum: 1 } } }
        ]);

        // Cashier Breakdown
        const cashierSales = await Order.aggregate([
            { $match: matchStage },
            { $group: { _id: "$cashier", total: { $sum: "$bills.totalWithTax" }, count: { $sum: 1 } } },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "cashierDetails" } },
            { $unwind: { path: "$cashierDetails", preserveNullAndEmptyArrays: true } },
            { $project: { _id: 1, total: 1, count: 1, name: "$cashierDetails.name" } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalSales: totalSales[0] || { total: 0, count: 0 },
                paymentMethods,
                cashierSales
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getReports };
