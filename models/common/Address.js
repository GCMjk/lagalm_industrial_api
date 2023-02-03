const { Schema } = require('mongoose');

const addressSchema = Schema({
    street: { type: String, required: true },
    exterior: { type: String, required: true },
    interior: { type: String, required: false },
    neighborhood: { type: String, required: true },
    city: { type: String, required: true },
    municipality: { type: String, required: true  },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: String, required: true },
    streets: { 
        a: { type: String, required: false },
        b: { type: String, required: false },
    }
});

module.exports = addressSchema;