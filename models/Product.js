const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    facturapiId: { type: String, required: false },
    description: { type: String, uppercase: true, required: true },
    customerPart: { type: String, required: true },
    productKey: { type: String, required: false },
    price: { 
        currency: { type: String, enum: ["USD", "MXN"], required: false },
        price: { type: Number, required: false }
    },
    taxIncluded: { type: Boolean, required: false },
    taxability: { type: String, enum: ["01", "02", "03"], required: false },
    unitKey: { type: String, required: false },
    unitName: { type: String, required: false },
    sku: { type: String, required: true },
    assigned: { type: Boolean, required: true },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'clients'
    },
    status: { type: Boolean, default: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('product', ProductSchema);