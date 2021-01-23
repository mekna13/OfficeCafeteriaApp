const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    customerId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: Object,
        required: true
    },
    
    paymentType: {
        type: String,
        required: true,
        default: 'COD'
    },
    paymentStatus: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'order_placed'
    },
    takeAwayTime: {
        type: String,
        default: 'To be set soon..'
    }

}, {timestamps: true});

module.exports = mongoose.model('Order', orderSchema)