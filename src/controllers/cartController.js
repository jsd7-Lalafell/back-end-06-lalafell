const Cart = require("../models/cart.model");

const getCart = async (req, res) => {
    try {
        const carts = await Cart.findOne({ orderBy: req.user.id }).populate('product.product');
        if (!carts) {
            return res
                .status(404) //edit status code
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

const updateCart2 = async (req, res) => {
    const { product, quantity, price, totalPrice } = req.body;
    const { id } = req.user;
    const cartId = req.params.cartId;

    // if () {
    //     return res.status(400).json({ error: true, message: "Please provide all fields" });
    // }
    console.log("test", req.body);
    try {
        let cart = await Cart.findOne({ orderBy: id }).populate("product.product");
        if (!cart) {
            // Create new cart if not exists
            try {
                const newCart = new Cart({
                    product,
                    quantity,
                    price,
                    totalPrice,
                    orderBy: id,
                });

                const savedCart = await newCart.save();
                return res.json({
                    error: false,
                    cart: savedCart,
                    message: "Cart created successfully",
                });
            } catch (error) {
                console.error(`Error in creating cart: ${error.message}`);
                return res
                    .status(500)
                    .json({ error: true, message: "Internal Server Error" });
            }
        }

        // Update existing cart
        let productExists = false;
        console.log("ใน mongo:", cart.product[0].product._id);
        console.log("ใน body:", product[0].product);
        for (let i = 0; i < cart.product.length; i++) {
            if (cart.product[i].product._id.toString() === product[0].product.toString()) {
                cart.product[i].quantity += product[0].quantity;
                cart.product[i].price += product[0].price; // Update the price if necessary
                productExists = true;
                break;
            }
        }

        if (!productExists) {
            console.log("debug", product);
            cart.product.push({
                product: product[0].product,
                quantity: product[0].quantity,
                price: product[0].price,
            });
        }

        console.log("debug2",cart.totalPrice);
        cart.totalPrice += totalPrice;

        const totalPrices = cart.product
            .map((e) => e.price)
            .reduce((sum, current) => sum + current, 0);
        cart.totalPrice = totalPrices;
        const savedCart = await cart.save();

        console.log(totalPrices);
        return res.json({
            error: false,
            cart: savedCart,
            message: "Cart updated successfully",
        });
    } catch (error) {
        console.error(`Error in updating cart: ${error.message}`);
        return res
            .status(500)
            .json({ error: true, message: "Internal Server Error" });
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
    updateCart2,
    deleteCart,
};
