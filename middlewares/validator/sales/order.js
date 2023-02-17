const { check } = require('express-validator');
const { validateResult } = require('../../../helpers/validateResult');

const Client = require('../../../models/sales/Client');
const Product = require('../../../models/sales/Product');

const validateOrder = [
    check('invoiceID')
        .isEmpty().withMessage('La propiedad del ID de Facturapi no debe ser definida'),
    check('customer')
        .not().isEmpty().withMessage('El cliente es requerido')
        .custom(async client => {
            const someClient = await Client.findOne({ _id: client });
            if (!someClient) throw new Error('El cliente no existe en la base de datos');
            return true;
        }),
    check('items')
        .isArray().withMessage('La propiedad de elementos debe ser un array'),
    check('items.*.quantity')
        .not().isEmpty().withMessage('La cantidad del producto es obligatoria')
        .isInt().withMessage('La cantidad del producto debe ser un entero'),
    check('items.*.product')
        .not().isEmpty().withMessage('El producto es obligatorio')
        .custom(async (product, { req }) => {
            const someProduct = await Product.findOne({ _id: product });
            if (!someProduct) throw new Error('El producto no existe en la base de datos');
            if (someProduct.client.toString() !== req.body.customer) throw new Error('El producto no le pertenece al cliente seleccionado');
            return true;
        }),
    check('state')
        .isEmpty().withMessage('El estado no puede ser modificado'),
        //.isIn(['RECEIVED', 'PRODUCING', 'PRODUCED', 'SENT', 'DELIVERED']).withMessage('Seleccione una opción valida para el estado de la orden'),
    check('status')
        .optional()
        .isBoolean().withMessage('El estado del producto debe ser un booleano'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

module.exports = { validateOrder };