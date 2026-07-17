const createHttpError = require("http-errors");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Product = require("../models/productModel");
const Settings = require("../models/settingsModel");
const Razorpay = require("razorpay");
const config = require("../config/config");
const { default: mongoose } = require("mongoose");

const calculateServerSideTotal = async (items) => {
  let calculatedTotal = 0;

  for (const item of items) {
    const productId = item.originalItemDetails?._id || item.originalItemDetails?.id;
    if (!productId) {
      throw createHttpError(400, `Item ${item.name} is missing original item details.`);
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw createHttpError(400, `Product not found for item: ${item.name}`);
    }

    let activePrice = Number(product.price);

    // Handle Portions
    if (product.hasPortions && item.variantId) {
      const portionSize = item.variantId.split("-").pop();
      if (product.portions && product.portions[portionSize] > 0) {
        activePrice = Number(product.portions[portionSize]);
      }
    } 
    // Handle Option Groups
    else if (product.optionGroups && product.optionGroups.length > 0 && item.variantId && item.variantId !== "default") {
      const optionParts = item.variantId.split("_");
      for (const part of optionParts) {
        const [groupId, optId] = part.split("-");
        const group = product.optionGroups.find(g => String(g.id) === String(groupId));
        if (group) {
          const opt = group.options.find(o => String(o.id) === String(optId));
          if (opt && opt.extraPrice) {
            activePrice += Number(opt.extraPrice);
          }
        }
      }
    }

    calculatedTotal += activePrice * item.quantity;
  }

  const settings = await Settings.findOne();
  const enableTaxes = settings?.enableTaxes ?? true;
  const taxRate = enableTaxes ? 5.25 : 0;
  const tax = Number(((calculatedTotal * taxRate) / 100).toFixed(2));
  const totalWithTax = Number((calculatedTotal + tax).toFixed(2));

  return { total: calculatedTotal, tax, totalWithTax };
};

const addOrder = async (req, res, next) => {
  try {
    const {
      customerDetails,
      orderStatus,
      orderType,
      bills,
      items,
      paymentMethod,
      paymentData,
    } = req.body;

    if (!bills || bills.total == null || bills.totalWithTax == null) {
      return next(createHttpError(400, "Bill details are required."));
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(createHttpError(400, "At least one item is required."));
    }

    const serverBills = await calculateServerSideTotal(items);
    bills.total = serverBills.total;
    bills.tax = serverBills.tax;
    bills.totalWithTax = serverBills.totalWithTax;

    // Server-side Payment Verification for Online Orders
    if (paymentMethod === "Online") {
      if (!paymentData || !paymentData.razorpay_order_id || !paymentData.razorpay_payment_id) {
        return next(createHttpError(400, "Online payments require Razorpay order and payment IDs."));
      }

      // Check database first
      let paymentRecord = await Payment.findOne({ paymentId: paymentData.razorpay_payment_id });

      if (!paymentRecord) {
        // Fallback: Verify directly with Razorpay API
        const razorpay = new Razorpay({
          key_id: config.razorpayKeyId,
          key_secret: config.razorpaySecretKey,
        });

        try {
          const paymentDetails = await razorpay.payments.fetch(paymentData.razorpay_payment_id);
          if (paymentDetails.status !== "captured") {
            return next(createHttpError(400, "Online payment has not been captured."));
          }
          // Confirm amount matches (Razorpay amount is in paisa)
          const paidAmount = paymentDetails.amount / 100;
          if (paidAmount < bills.totalWithTax) {
            return next(createHttpError(400, `Paid amount (${paidAmount} PKR) is less than order total (${bills.totalWithTax} PKR).`));
          }
        } catch (err) {
          return next(createHttpError(400, "Failed to verify payment with Razorpay: " + err.message));
        }
      } else {
        // Payment is in database, verify amount
        if (paymentRecord.amount < bills.totalWithTax) {
          return next(createHttpError(400, `Paid amount (${paymentRecord.amount} PKR) is less than order total (${bills.totalWithTax} PKR).`));
        }
      }
    }

    // Build the order document strictly, avoiding mass assignment
    const order = new Order({
      customerDetails: {
        name: customerDetails?.name || "Customer",
        phone: customerDetails?.phone || "",
        guests: customerDetails?.guests || 1,
      },
      orderStatus: orderStatus || "In Progress",
      orderType: orderType || "Dine In",
      bills: {
        total: bills.total,
        tax: bills.tax || 0,
        totalWithTax: bills.totalWithTax,
      },
      items,
      paymentMethod: paymentMethod || "Cash",
      paymentData: paymentMethod === "Online" ? {
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id
      } : undefined,
      cashier: req.user._id, // Set the cashier to the authenticated user ID
    });

    await order.save();

    res.status(201).json({ success: true, message: "Order created!", data: order });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

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
    const { page, limit } = req.query;

    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 20);
      const skip = (pageNum - 1) * limitNum;

      const total = await Order.countDocuments();
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      return res.status(200).json({
        success: true,
        data: orders,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const {
      orderStatus,
      customerDetails,
      bills,
      items,
      paymentMethod,
      paymentData,
    } = req.body;

    const updateData = {};

    if (orderStatus !== undefined) updateData.orderStatus = orderStatus;
    if (customerDetails !== undefined) {
      updateData.customerDetails = {
        name: customerDetails.name,
        phone: customerDetails.phone,
        guests: customerDetails.guests,
      };
    }
    if (items !== undefined) {
      updateData.items = items;
      const serverBills = await calculateServerSideTotal(items);
      updateData.bills = {
        total: serverBills.total,
        tax: serverBills.tax,
        totalWithTax: serverBills.totalWithTax,
      };
    } else if (bills !== undefined) {
      // If items aren't changed but bills are passed, ignore the client's bills to prevent spoofing
      // The bill remains what it was on the server.
    }
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;

    if (paymentMethod === "Online" || (paymentMethod === undefined && paymentData !== undefined)) {
      // If changing to Online payment or updating paymentData, verify payment
      const pData = paymentData || (await Order.findById(id))?.paymentData;
      if (!pData || !pData.razorpay_order_id || !pData.razorpay_payment_id) {
        return next(createHttpError(400, "Online payments require Razorpay order and payment IDs."));
      }

      // Check database first
      let paymentRecord = await Payment.findOne({ paymentId: pData.razorpay_payment_id });

      const checkBills = updateData.bills || (await Order.findById(id))?.bills;
      const targetAmount = checkBills?.totalWithTax || 0;

      if (!paymentRecord) {
        const razorpay = new Razorpay({
          key_id: config.razorpayKeyId,
          key_secret: config.razorpaySecretKey,
        });

        try {
          const paymentDetails = await razorpay.payments.fetch(pData.razorpay_payment_id);
          if (paymentDetails.status !== "captured") {
            return next(createHttpError(400, "Online payment has not been captured."));
          }
          const paidAmount = paymentDetails.amount / 100;
          if (paidAmount < targetAmount) {
            return next(createHttpError(400, `Paid amount (${paidAmount} PKR) is less than order total (${targetAmount} PKR).`));
          }
        } catch (err) {
          return next(createHttpError(400, "Failed to verify payment with Razorpay: " + err.message));
        }
      } else {
        if (paymentRecord.amount < targetAmount) {
          return next(createHttpError(400, `Paid amount (${paymentRecord.amount} PKR) is less than order total (${targetAmount} PKR).`));
        }
      }
      
      updateData.paymentData = {
        razorpay_order_id: pData.razorpay_order_id,
        razorpay_payment_id: pData.razorpay_payment_id
      };
    }

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
