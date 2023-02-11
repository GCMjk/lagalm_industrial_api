const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = Schema({
    facturapiId: { type: String, required: false },
    legalName: { type: String, uppercase: true, required: true },
    bussinessActivity: {
        activity: { type: String, enum: [ "INDUSTRIAL", "COMMERCIAL", "SERVICE" ], required: true },
        description: { type: String, required: true }
    },
    taxId: { type: String, uppercase: true, required: false },
    taxSystem: { type: String, enum: ["", "601", "603", "605", "606", "607", "608", "610", "611", "612", "614", "615", "616", "620", "621", "622", "623", "624", "625", "626"], required: false },
    taxEmail: { type: String, required: false },
    expiration: { type: Number, required: false },
    cdfi: { type: String, required: false },
    paymentForm: { type: String, required: false },
    paymentMethod: { type: String, enum: ["PUE", "PPD"], required: false },
    contact: {
        email: { type: String, required: true },
        phone: { type: String, required: false },
        web: { type: String, required: false },
        contactPersonalized: [
            {
                title: { type: String, enum: [ "LIC", "ING", "SR", "SRA", "UNDEFINED" ], required: true },
                name: { type: String, required: true },
                workPosition: { type: String, enum: [ "SALES", "PURCHASING", "MANAGER", "MARKETING", "DEVELOPER", "HUMAN RESOURCES", "SYSTEMS", "OTHER" ], required: true },
                email: { type: String, required: true },
                phone: { type: String, required: false },
            }
        ]
    },
    address: { 
        street: { type: String, required: false },
        exterior: { type: String, required: false },
        interior: { type: String, required: false },
        neighborhood: { type: String, required: false },
        city: { type: String, required: false },
        municipality: { type: String, required: false  },
        state: { type: String, required: false },
        country: { type: String, required: false },
        zip: { type: String, match: /^[0-9]+$/, required: false },
        streets: { 
            a: { type: String, required: false },
            b: { type: String, required: false },
        }
    },
    type: { type: String, enum: [ "PROSPECT", "CLIENT" ], default: "PROSPECT", required: true },
    proofOfTaxSitutation: { type: String, required: false },
    password: { type: String, required: false },
    verify: { type: Boolean, default: false, required: true },
    logo: { type: String, required: false },
    lastSession: { type: String, default: "", required: false },
    status: { type: Boolean, default: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('client', ClientSchema);