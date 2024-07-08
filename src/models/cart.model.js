const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    product: [{
        product: {
            type: ObjectId,
            ref: 'Product'
        },
        quantity: Number,
        price: Number,
    }],
    totalPrice: Number,

})

module.exports = mongoose.model('Cart', cartSchema);