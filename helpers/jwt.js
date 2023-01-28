const jwt = require('jwt-simple');
const moment = require('moment');
const secret = '123';

exports.createToken = (user) => {
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(1, 'day').unix()
    }

    return jwt.encode(payload, secret);
}