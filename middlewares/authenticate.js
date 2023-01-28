const jwt = require('jwt-simple');
const moment = require('moment');
const secret = '123';

exports.auth = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).send({ message: 'Error en la petición, cabeceras invalidas.' });
    }

    var token = req.headers.authorization.replace(/['"]+/g,'');
    var segment = token.split('.');

    if(segment.length != 3){
        return res.status(403).send({ message:'Token inválido.' });
    }else{
        
        try {
            var payload = jwt.decode(token,secret);
            if(payload.exp <= moment().unix()){
                return res.status(403).send({ message:'El token ah expirado.' });
            }
        } catch (error) {
            return res.status(403).send({message:'Token no válido.'});
        }
    }

    req.user = payload;

    next();
}