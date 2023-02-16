const { check } = require('express-validator');
const validateRfc = require('validate-rfc');
const { validateResult } = require('../../../helpers/validateResult');
const Client = require('../../../models/sales/Client');

const validateClient = [
    check('legalName')
        .not().isEmpty().withMessage('El nombre de la empresa es requerido')
        .toUpperCase()
        .custom(async legalName => {
            const someLegalName = await Client.find({ legalName });
            if (someLegalName.length >= 1) throw new Error('El nombre de la empresa ya existe, intente con otro');
            return true;
        }),
    check('bussinessActivity.activity')
        .not().isEmpty().withMessage('La actividad empresarial es requerida')
        .isIn(['INDUSTRIAL', 'COMMERCIAL', 'SERVICE']).withMessage('Selecciona una opcion válida para la actividad empresarial'),
    check('bussinessActivity.description')
        .not().isEmpty().withMessage('La descripción de la actividad empresarial es requerida'),
    check('tax.facturapiID')
        .isEmpty().withMessage('La propiedad del ID de Facturapi no debe ser definida'),
    check('tax.taxID')
        .optional()
        .toUpperCase()
        .custom(async rfc => {
            const someRFC = await Client.find({ 'tax.taxID': rfc });
            if (someRFC.length >= 1) throw new Error('El RFC ya existe, intente con otro');
            if (!validateRfc(rfc).isValid) throw new Error('El RFC no es de un formato válido');
            if (validateRfc(rfc).type !== 'company') throw new Error('El RFC no es de una empresa');
            return true;
        }),
    check('tax.taxSystem')
        .optional()
        .isIn(['601', '603', '605', '606', '607', '608', '610', '611', '612', '614', '615', '616', '620', '621', '622', '623', '624', '625', '626']).withMessage('Selecciona una opcion válida para el sistema de facturación')
        .toUpperCase(),
    check('tax.taxEmail')
        .optional()
        .isEmail().withMessage('Correo de facturación inválido')
        .toLowerCase(),
    check('tax.daysOfExpiration')
        .optional()
        .isNumeric().withMessage('Los dias de expiración debe ser un número'),
    check('tax.use')
        .optional()
        .isIn(['G01', 'G02', 'G03', 'I01', 'I02', 'I03', 'I04', 'I05', 'I06', 'I07', 'I08', 'D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09', 'D10', 'S01', 'CP01', 'CN01']).withMessage('Selecciona una opcion válida para el CDFI'),
    check('tax.paymentForm')
        .optional()
        .isIn(['01', '02', '03', '04', '05', '06', '08', '12', '13', '14', '15', '17', '23', '24', '25', '26', '27', '28', '29', '30', '31', '99']).withMessage('Selecciona una opcion válida para la forma de pago'),
    check('tax.paymentMethod')
        .optional()
        .isIn(['PUE', 'PPD']).withMessage('Selecciona una opcion válida para el metodo de pago'),
    check('tax.currency')
        .optional()
        .isIn(['MXN', 'USD']).withMessage('Selecciona una opción válida para el tipo de moneda'),
    check('tax.taxIncluded')
        .optional()
        .isBoolean().withMessage('La propiedad de impuestos incluidos debe ser un booleano'),
    check('contact.email')
        .toLowerCase()
        .isEmail().withMessage('Correo de contacto inválido')
        .custom(async email => {
            const someEmail = await Client.find({ 'contact.email': email });
            if(someEmail.length >= 1) throw new Error('El correo de contacto ya existe, intente con otro');
            return true;
        }),
    check('contact.phone')
        .optional()
        .isNumeric().withMessage('El número de contacto debe ser un número'),
    check('contact.web')
        .optional(),
    check('contact.contactPersonalized.title')
        .optional()
        .isIn(['LIC', 'ING', 'SR', 'SRA', 'OTHER']).withMessage('Seelecciona una opción válida para el titulo del contacto peersonalizado'),
    check('contact.contactPersonalized.name')
        .optional(),
    check('contact.contactPersonalized.workPosition')
        .optional()
        .isIn(['SALES', 'PURCHASING', 'MANAGER', 'MARKETING', 'DEVELOPER', 'HUMAN RESOURCES', 'SYSTEMS', 'OTHER']).withMessage('Selecciona una opción válida para la posición del contacto personalizado'),
    check('contact.contactPersonalized.email')
        .optional()
        .isEmail().withMessage('Correo de contacto peersonalizado inválido'),
    check('contact.contactPersonalized.phone')
        .optional()
        .isNumeric().withMessage('El número de contacto personalizado debe ser un número'),
    check('address.zip')
        .optional()
        .isPostalCode('US').isPostalCode('MX').withMessage('Codigo postal inválido'),
    check('type')
        .isIn(['PROSPECT', 'CLIENT']).withMessage('Selecciona una opción válida para el tipo de cliente'),
    check('verify')
        .isEmpty().withMessage('La propiedad de verificación no debe ser definida'),
    check('lastSession')
        .isEmpty().withMessage('La propiedad de ultimo inicio de sesión no debe ser definida'),
    check('status')
        .isEmpty().withMessage('La propiedad de verificación no debe ser definida'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

module.exports = { validateClient };