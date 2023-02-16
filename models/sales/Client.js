const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = require('../common/Contact');
const AddressSchema = require('../common/Address');

const ClientSchema = Schema({
    legalName: { 
        type: String,
        required: false
    },
    bussinessActivity: {
        activity: { 
            type: String, 
            enum: ["INDUSTRIAL", "COMMERCIAL", "SERVICE"],
            required: true
        },
        description: { 
            type: String, 
            required: true
        }
    },
    tax: {
        facturapiID: String,
        taxID: String,
        taxSystem: { 
            type: String, 
            enum: ["601", "603", "605", "606", "607", "608", "610", "611", "612", "614", "615", "616", "620", "621", "622", "623", "624", "625", "626"]
        },
        taxEmail: String,
        daysOfExpiration: Number,
        use: { 
            type: String, 
            enum: ["G01", "G02", "G03", "I01", "I02", "I03", "I04", "I05", "I06", "I07", "I08", "D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "D09", "D10", "S01", "CP01", "CN01"]
        },
        paymentForm: { 
            type: String, 
            enum: ["01", "02", "03", "04", "05", "06", "08", "12", "13", "14", "15", "17", "23", "24", "25", "26", "27", "28", "29", "30", "31", "99"]
        },
        paymentMethod: { 
            type: String,
            enum: ["PUE", "PPD"]
        },
        currency: { 
            type: String, 
            enum: ["MXN", "USD"]
        },
        taxIncluded: Boolean,
        proofOfTaxSitutation: String
    },
    contact: ContactSchema,
    address: AddressSchema,
    type: { 
        type: String, 
        enum: ["PROSPECT", "CLIENT"],
        required: true
    },
    password: String,
    logo: String,
    verify: { 
        type: Boolean, 
        default: false
    },
    lastSession: { 
        type: Date, 
        default: ""
    },
    status: { 
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('client', ClientSchema);