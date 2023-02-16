const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = Schema({
    email: String,
    phone: Number,
    web: String,
    contactPersonalized: {
        title: { 
            type: String, 
            enum: [ "LIC", "ING", "SR", "SRA", "OTHER" ]
        },
        name: String,
        workPosition: { 
            type: String,
            enum: [ "SALES", "PURCHASING", "MANAGER", "MARKETING", "DEVELOPER", "HUMAN RESOURCES", "SYSTEMS", "OTHER" ]
        },
        email: String,
        phone: Number
    }
});

module.exports = ContactSchema;