const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    facturapiID: String,
    description: { 
        type: String,
        required: true 
    },
    customerPart: String,
    productKey: {
        type: String,
        enum: ["31141501", "84111506"]
    },
    price: Number,
    taxIncluded: {
        type:Boolean,
        default: false
    },
    taxability: { 
        type: String, 
        enum: ["01", "02", "03"]
    },
    unitKey: {
        type: String,
        enum: ["H87", "EA"]
    },
    unitName: {
        type: String,
        enum: ["Pieza", "Elemento"]
    },
    sku: String,
    assigned: { 
        type: Boolean, 
        default: false
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    status: { 
        type: Boolean, 
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('product', ProductSchema);