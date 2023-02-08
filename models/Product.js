const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    facturapiId: { type: String, required: false },
    description: { type: String, uppercase: true, required: true },
    customerPart: { type: String, required: false },
    productKey: { type: String, required: true },
    price: { 
        currency: { type: String, enum: ["USD", "MXN"], required: true },
        price: { type: Number, required: true }
    },
    unitKey: { type: String, required: true },
    unitName: { type: String, required: true },
    sku: { type: String, required: true },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'clients'
    },
    status: { type: Boolean, default: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('product', ProductSchema);