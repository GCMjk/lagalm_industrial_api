const { Schema } = require('mongoose');

const contactSchema = Schema({
    email: { type: String, required: true },
    phone: { type: String, required: false },
    web: { type: String, required: false },
    contactPersonalized: { 
        type: [
            {
                title: { type: String, enum: [ "LIC", "ING", "SR", "SRA", "UNDEFINED" ], required: true },
                name: { type: String, required: true },
                workPosition: { type: String, enum: [ "VENTAS", "COMPRAS", "GERENTE", "MERCADOTECNIA", "DESARROLLADOR", "RECURSOS HUMANOS", "SISTEMAS", "OTRO" ], required: true },
                email: { type: String, required: true },
                phone: { type: String, required: false },
            }
        ],
        required: false
    },
});

module.exports = contactSchema;