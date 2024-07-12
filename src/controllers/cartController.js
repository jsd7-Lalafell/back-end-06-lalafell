const Cart = require("../models/cart.model");

const getCart = async (req, res) => {
    try {
        const carts = await Cart.findOne({ orderBy: req.user.id }).populate('product.product');
        if (!carts) {
            return res
                .status(404)
                .json({ message: 'Cart not found' });
        }
        return res.json({ error: false, carts });

    }
    catch (error) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error' });
    }
};

const createCart = async (req, res) => {
    const { product, quantity, price, totalPrice } = req.body;
    const { id } = req.user;

    if (!product || !totalPrice) {
        return res
            .status(400)
            .json({ error: true, message: "Please provide all fields" });
    }

    try {
        const cart = new Cart({
            product,
            quantity,
            price,
            totalPrice,
            orderBy: id
        });

        const savedCart = await cart.save();
        return res.json({ error: false, cart: savedCart, message: 'Cart created successfully' });
    } catch (error) {
        console.error(`Error in creating cart: ${error.message}`);
        return res
            .status(500)
            .json({ error: true, message: 'Internal Server Error' });
    }
};

const updateCart = async (req, res) => {
    const { product, quantity, price, totalPrice } = req.body;
    const { id } = req.user;
    const cartId = req.params.cartId;

    if (!product || !totalPrice) {
        return res
            .status(400)
            .json({ error: true, message: "Please provide all fields" });
    }

    try {
        const cart = await Cart.findOne({ _id: cartId, orderBy: id });
        if (!cart) {
            return res
                .status(404)
                .json({ error: true, message: 'Cart not found' });
        }

        cart.product = product;
        cart.quantity = quantity;
        cart.price = price;
        cart.totalPrice = totalPrice;

        const savedCart = await cart.save();
        return res.json({ error: false, cart: savedCart, message: 'Cart updated successfully' });
    } catch (error) {
        console.error(`Error in updating cart: ${error.message}`);
        return res
            .status(500)
            .json({ error: true, message: 'Internal Server Error' });
    }
};

const deleteCart = async (req, res) => {
    const cartId = req.params.cartId;
    const { id } = req.user;

    try {
        const cart = await Cart.findOne({ _id: cartId, orderBy: id });

        if (!cart) {
            return res.status(404).json({ error: true, message: 'Cart not found' });
        }

        await Cart.deleteOne({ _id: cartId, orderBy: id });
        return res.json({ error: false, message: 'Cart deleted successfully' });

    } catch (error) {
        console.error(`Error in deleting cart: ${error.message}`);
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

module.exports = {
    getCart,
    createCart,
    updateCart,
    deleteCart,
};
