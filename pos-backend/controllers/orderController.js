const createHttpError = require("http-errors");
const Order = require("../models/orderModel");
const { default: mongoose } = require("mongoose");

const addOrder = async (req, res, next) => {
  try {
    if (global.dbConnected === false) {
      const mockDb = require("../utils/mockDb");
      const order = {
        _id: "mock-order-" + Date.now(),
        ...req.body,
        orderDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockDb.orders.push(order);
      return res
        .status(201)
        .json({ success: true, message: "Order created!", data: order });
    }

    const order = new Order(req.body);
    await order.save();
    res
      .status(201)
      .json({ success: true, message: "Order created!", data: order });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (global.dbConnected === false) {
      const mockDb = require("../utils/mockDb");
      const order = mockDb.orders.find(o => o._id === id);
      if (!order) {
        const error = createHttpError(404, "Order not found!");
        return next(error);
      }
      return res.status(200).json({ success: true, data: order });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findById(id);
    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    if (global.dbConnected === false) {
      const mockDb = require("../utils/mockDb");
      const populatedOrders = mockDb.orders.map(order => {
        let tableObj = null;
        if (order.table) {
          tableObj = mockDb.tables.find(t => t._id === order.table);
        }
        return {
          ...order,
          table: tableObj
        };
      });
      return res.status(200).json({ data: populatedOrders });
    }

    const orders = await Order.find().populate("table");
    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const {
      orderStatus,
      customerDetails,
      bills,
      items,
      paymentMethod,
      paymentData,
      table,
    } = req.body;
    const { id } = req.params;

    if (global.dbConnected === false) {
      const mockDb = require("../utils/mockDb");
      const order = mockDb.orders.find(o => o._id === id);
      if (!order) {
        const error = createHttpError(404, "Order not found!");
        return next(error);
      }

      if (orderStatus !== undefined) order.orderStatus = orderStatus;
      if (customerDetails !== undefined) order.customerDetails = customerDetails;
      if (bills !== undefined) order.bills = bills;
      if (items !== undefined) order.items = items;
      if (paymentMethod !== undefined) order.paymentMethod = paymentMethod;
      if (paymentData !== undefined) order.paymentData = paymentData;
      if (table !== undefined) order.table = table;

      order.updatedAt = new Date();
      return res
        .status(200)
        .json({ success: true, message: "Order updated", data: order });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const updateData = {};

    if (orderStatus !== undefined) updateData.orderStatus = orderStatus;
    if (customerDetails !== undefined) updateData.customerDetails = customerDetails;
    if (bills !== undefined) updateData.bills = bills;
    if (items !== undefined) updateData.items = items;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (paymentData !== undefined) updateData.paymentData = paymentData;
    if (table !== undefined) updateData.table = table;

    if (Object.keys(updateData).length === 0) {
      const error = createHttpError(400, "No order fields provided for update!");
      return next(error);
    }

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });

    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res
      .status(200)
      .json({ success: true, message: "Order updated", data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { addOrder, getOrderById, getOrders, updateOrder };
