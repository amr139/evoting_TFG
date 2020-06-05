var jwt = require('jwt-simple')
var moment = require('moment')

function CreateToken(obj) {
    let payload = {
        sub: obj.vid,
        dni: obj.dni,
        city:obj.city,
        iat: moment().unix(),
        exp: moment().add(3, 'minutes').unix(),
    }
    return jwt.encode(payload, process.env.keytoken)
}

function CheckToken(token) {

    try {
        let payload = jwt.decode(token, process.env.keytoken)
        if (payload.exp <= moment().unix()) {
            return {resultado:false,data:"La sesion ha expirado. Inicie sesion de nuevo"}
        } else {
            return {resultado:true,data:payload}
        }
    } catch (err) {
        return {resultado:false,data:"Se ha producido un error especial"}
    }
}

module.exports = { CreateToken, CheckToken }