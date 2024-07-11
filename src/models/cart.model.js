const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    product: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',   //อ้างอิงถึง Schema product
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        default: 0
    },
    orderBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Cart', cartSchema);