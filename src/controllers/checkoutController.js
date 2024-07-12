const Checkout = require("../models/checkout.model");

const getCheckout = async (req, res) => {
    try {
        const checkouts = await Checkout.find({ userId: req.user.id }).populate('items.productId');
        if (!checkouts || checkouts.length === 0) {
            return res.status(404).json({ error: true, message: 'Checkout not found' });
        }
        return res.json({ error: false, checkouts });

    } catch (error) {
        console.error(`Error in getCheckout: ${error.message}`);
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

const createCheckout = async (req, res) => {
    const { items, total, paymentMethod, address } = req.body;
    
    try {
        if (!items || !total || !paymentMethod || !address) {
            return res.status(400).json({ error: true, message: 'Missing required fields' });
        }

        const newCheckout = new Checkout({
            userId: req.user.id,
            items,
            total,
            paymentMethod,
            address
        });

        const savedCheckout = await newCheckout.save();
        return res.status(201).json({ error: false, checkout: savedCheckout });

    } catch (error) {
        console.error(`Error in createCheckout: ${error.message}`);
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

module.exports = {
    getCheckout,
    createCheckout,
};
