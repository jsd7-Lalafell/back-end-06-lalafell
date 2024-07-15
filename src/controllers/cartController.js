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


/* const updateCart = async (req, res) => {
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
}; */
const updateCartItem = async (req, res) => {
    const productId = req.params.cartId;
    const { id } = req.user;
    const {quantity} = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: true, message: "Invalid quantity" });
    }

    try {
        const cart = await Cart.findOne({ orderBy: id });

        if (!cart) {
            return res.status(404).json({ error: true, message: 'Cart not found' });
        }

        const productIndex = cart.product.findIndex(p => p.product.toString() === productId);
        if (productIndex > -1) {
            cart.product[productIndex].quantity = quantity;
            cart.totalPrice = cart.product.reduce((sum, item) => sum + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json({ message: 'Cart item updated', cart });
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error(`Error in updating cart item: ${error.message}`);
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};


const updateCart = async (req, res) => {
    const { product, quantity, price, totalPrice } = req.body;
    const { id } = req.user;
    const cartId = req.params.cartId;

    if (!product || !totalPrice) {
        return res.status(200).json({ error: true, message: "Please provide all fields" });
    }
    // console.log("test", req.body);
    try {
        let cart = await Cart.findOne({ orderBy: id }).populate("product.product");
        console.log("testCart", cart);
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
        for (let i = 0; i < cart.product.length; i++) {
            if (cart.product[i].product._id.toString() === product[0].product.toString()) {
                cart.product[i].quantity += product[0].quantity;// Update the price if necessary
                productExists = true;
            }

        }
        if (!productExists) {
            cart.product.push({
                product: product[0].product,
                quantity: product[0].quantity,
                price: product[0].price,
            });
        }


        // calculate total price
        console.log("Debug", cart)
        // cart.totalPrice = totalPrice;
        const totalPrices = cart.product.reduce((sum, current) => sum + current.price * current.quantity, 0);
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

/* const deleteCart = async (req, res) => {
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
}; */
const deleteCart = async (req, res) => {
    const productId = req.params.cartId;
    const { id } = req.user;

    try {
        const cart = await Cart.findOne({ orderBy: id });

        if (!cart) {
            return res.status(404).json({ error: true, message: 'Cart not found' });
        }

        const productIndex = cart.product.findIndex(p => p.product.toString() === productId);
        if (productIndex > -1) {
            cart.product.splice(productIndex, 1);
            cart.totalPrice = cart.product.reduce((sum, item) => sum + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json({ message: 'Product removed from cart' });
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error(`Error in deleting product from cart: ${error.message}`);
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

module.exports = {
    getCart,
    createCart,
    updateCartItem,
    updateCart,
    deleteCart,
};
