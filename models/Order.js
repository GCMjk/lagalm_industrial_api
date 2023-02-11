const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = Schema({
    facturapiId: { type: String, required: false },
    customer: { 
        type: Schema.Types.ObjectId,
        ref: 'clients',
        required: true
    },
    items: [
        {
            quantity: { type: Number, required: true },
            product: { 
                type: Schema.Types.ObjectId,
                ref: 'clients',
                required: true
            }
        }
    ],
    invoiceId: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('order', OrderSchema);