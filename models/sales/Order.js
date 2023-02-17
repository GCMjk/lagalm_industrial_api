const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = Schema({
    invoiceID: String,
    customer: { 
        type: Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    items: [
        {
            quantity: { 
                type: Number,
                required: true
            },
            product: { 
                type: Schema.Types.ObjectId,
                ref: 'product',
                required: true
            }
        }
    ],
    state: { 
        type: String,
        enum: ["RECEIVED", "PRODUCING", "PRODUCED", "SENT", "DELIVERED"],
        default: "RECEIVED",
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('order', OrderSchema);