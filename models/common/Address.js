const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = Schema({ 
    street: String,
    exterior: String,
    interior: String,
    neighborhood: String,
    city: String,
    municipality: String ,
    state: String,
    country: String,
    zip: { 
        type: String,
        required: true
    },
    streets: { 
        a: String,
        b: String,
    }
});

module.exports = AddressSchema;