const { check } = require('express-validator');
const { validateResult } = require('../../../helpers/validateResult');
const Client = require('../../../models/sales/Client');
const Product = require('../../../models/sales/Product');

const validateProduct = [
    check('facturapiID')
        .isEmpty().withMessage('La propiedad del ID de Facturapi no debe ser definida'),
    check('description')
        .not().isEmpty().withMessage('El nombre del producto es requerido')
        .toUpperCase()
        .custom(async description => {
            const someDescription = await Product.find({ description });
            if (someDescription.length >= 1) throw new Error('El nombre del producto ya existe');
            return true;
        }),
    check('customerPart')
        .optional()
        .custom(async customerPart => {
            const someCustomerPart = await Product.find({ customerPart });
            if (someCustomerPart.length >= 1) throw new Error('El número de parte del cliente ya existe');
            return true;
        }),
    check('productKey')
        .optional()
        .isIn(['31141501', '84111506']).withMessage('La clave del producto no es válido, 31141501 o 84111506'),
    check('price')
        .optional()
        .isNumeric().withMessage('El precio debe ser un número'),
    check('taxIncluded')
        .optional()
        .isBoolean().withMessage('Si el precio tiene los impuestos incluidos, debe ser un booleano'),
    check('taxability')
        .optional()
        .isIn(['01', '02', '03']).withMessage('Selecciona una opcion válida si el producto esta objeto a impuestos'),
    check('unitKey')
        .optional()
        .isIn(['H87', 'EA']).withMessage('Selecciona una opcion válida para la clave de la unidad'),
    check('unitName')
        .optional()
        .isIn(['Pieza', 'Elemento']).withMessage('Selecciona una opcion válida para el nombre de la unidad'),
    check('sku')
        .optional()
        .custom(async sku => {
            const someSku = await Product.find({ sku });
            if (someSku.length >= 1) throw new Error('El SKU del producto ya existe');
            return true;
        }),
    check('assigned')
        .isBoolean().withMessage('La asignación del producto debe ser un booleano'),
    check('client')
        .not().isEmpty().withMessage('El cliente del producto es requerido')
        .custom(async client => {
            const someClient = await Client.findOne({ _id: client });
            if (!someClient) throw new Error('El cliente no existe');
            return true
        }),
    check('status')
        .optional()
        .isBoolean().withMessage('El estado del producto debe ser un booleano'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

module.exports = { validateProduct };