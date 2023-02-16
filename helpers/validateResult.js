const { validationResult } = require('express-validator');

const validateResult = ( req, res, next ) => {
    try {
        validationResult(req).throw();
        return next();
    } catch (e) {
        res.status(403).send({ message: e.errors[0].msg })
    }
}

module.exports = {
    validateResult
}