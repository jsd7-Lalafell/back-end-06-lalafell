const OrderHistory = require("../models/orderHistorySchema.model");

const createOrder = async (req, res) => {
    try {
        const newOrder = new OrderHistory(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: "Invalid data" });
    }
};

const getOrderHistory = async (req, res) => {
    try {
        const orders = await OrderHistory.find();
        if (!orders) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getOrderHistoryById = async (req, res) => {
    try {
        const orders = await OrderHistory.findOne({ user: req.params._id });
        if (!orders) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createOrder, getOrderHistory, getOrderHistoryById };
