const axios = require('axios')

function CrearVerification() {
    var axiosOptions = {
        method: 'PUT',
        url: 'https://api.streetcred.id/agency/v1/verifications/policy/d93d7598-c175-4559-0b13-08d7ed58d81b',
        headers: {
            'Authorization': process.env.apikey,
            'Content-Type': 'application/json'
        }
    };
    return axios(axiosOptions);
}

function DameDatosVerification(verificationId) {

    var axiosOptions = {
        method: 'GET',
        url: 'https://api.streetcred.id/agency/v1/verifications/' + verificationId,
        headers: {
            'Authorization': process.env.apikey,
            'Content-Type': 'application/json'
        }
    };
    return axios(axiosOptions);
}

module.exports = { CrearVerification, DameDatosVerification }