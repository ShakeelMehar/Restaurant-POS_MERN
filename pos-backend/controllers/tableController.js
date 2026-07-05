const Table = require("../models/tableModel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose")

const addTable = async (req, res, next) => {
  try {
    const { tableNo, seats } = req.body;
    if (!tableNo) {
      const error = createHttpError(400, "Please provide table No!");
      return next(error);
    }

    if (global.dbConnected === false) {
      const mockDb = require("../utils/mockDb");
      const isTablePresent = mockDb.tables.find(t => t.tableNo === Number(tableNo));

      if (isTablePresent) {
        const error = createHttpError(400, "Table already exist!");
        return next(error);
      }

      const newTable = {
        _id: "mock-table-" + Date.now(),
        tableNo: Number(tableNo),
        seats: Number(seats),
        status: "Available",
        currentOrder: null
      };
      mockDb.tables.push(newTable);
      return res.status(201).json({ success: true, message: "Table added!", data: newTable });
    }

    const isTablePresent = await Table.findOne({ tableNo });

    if (isTablePresent) {
      const error = createHttpError(400, "Table already exist!");
      return next(error);
    }

    const newTable = new Table({ tableNo, seats });
    await newTable.save();
    res
      .status(201)
      .json({ success: true, message: "Table added!", data: newTable });
  } catch (error) {
    next(error);
  }
};

const getTables = async (req, res, next) => {
  try {
    if (global.dbConnected === false) {
      const mockDb = require("../utils/mockDb");
      const populatedTables = mockDb.tables.map(table => {
        let currentOrder = null;
        if (table.currentOrder) {
          const order = mockDb.orders.find(o => o._id === table.currentOrder);
          if (order) {
            currentOrder = {
              _id: order._id,
              customerDetails: order.customerDetails
            };
          }
        }
        return {
          ...table,
          currentOrder
        };
      });
      return res.status(200).json({ success: true, data: populatedTables });
    }

    const tables = await Table.find().populate({
      path: "currentOrder",
      select: "customerDetails"
    });
    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    next(error);
  }
};

const updateTable = async (req, res, next) => {
  try {
    const { status, orderId } = req.body;
    const { id } = req.params;

    if (global.dbConnected === false) {
      const mockDb = require("../utils/mockDb");
      const table = mockDb.tables.find(t => t._id === id);
      if (!table) {
        const error = createHttpError(404, "Table not found!");
        return next(error);
      }
      if (status !== undefined) table.status = status;
      if (orderId !== undefined) table.currentOrder = orderId;
      return res.status(200).json({ success: true, message: "Table updated!", data: table });
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
        const error = createHttpError(404, "Invalid id!");
        return next(error);
    }

    const table = await Table.findByIdAndUpdate(
        id,
      { status, currentOrder: orderId },
      { new: true }
    );

    if (!table) {
      const error = createHttpError(404, "Table not found!");
      return error;
    }

    res.status(200).json({success: true, message: "Table updated!", data: table});

  } catch (error) {
    next(error);
  }
};

module.exports = { addTable, getTables, updateTable };
