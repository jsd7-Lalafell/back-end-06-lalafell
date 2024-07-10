const Order = require('../models/order.model');

const getOrder = async (req, res) => {
    try {
        const orders = await Order.find({ createdBy: req.user._id })
            .populate('orderItems.product');
        if (!orders || orders.length === 0) {
            return res
                .status(404)
                .json({ error: true, message: 'Order not found' });
        }
        return res.json({ error: false, orders });

    } catch (error) {
        return res
            .status(500)
            .json({ error: true, message: 'Internal Server Error' });
    }
};

const createOrder = async (req, res) => {
    const { orderItems, totalPrice, orderDate, orderStatus, user, address, payment } = req.body;
    const { id } = req.user;

    if (!orderItems || !totalPrice || !orderDate || !orderStatus || !user || !address || !payment) {
        return res
            .status(400)
            .json({ error: true, message: 'Please provide all fields' });
    }

    try {
        const newOrder = new Order({
            orderItems,
            totalPrice,
            orderDate,
            orderStatus,
            user,
            address,
            payment,
            createdBy: id
        });

        const savedOrder = await newOrder.save();
        return res.json({ error: false, order: savedOrder, message: 'Order created successfully' });
    } catch (error) {
        return res
            .status(500)
            .json({ error: true, message: 'Internal Server Error' });
    }
};

module.exports = { getOrder, createOrder };
