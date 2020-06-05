const axios = require('axios')

function DarDeAlta(array) {

    var axiosOptions = {
        method: 'POST',
        url: 'https://api.streetcred.id/agency/v1/credentials',
        data: {
            "definitionId": definitionId,
            "automaticIssuance": true,
            "credentialValues": {
                "Nombre": array.nombre,
                "DNI": array.dni,
                "Ciudad": array.ciudad
            }
        },
        headers: {
            'Authorization': process.env.apikey,
            'Content-Type': 'application/json'
        },
        json: true
    };
    return axios(axiosOptions);
}

function ListaAltas(array) {

    var axiosOptions = {
        method: 'GET',
        url: 'https://api.streetcred.id/agency/v1/credentials?definitionId='+process.env.definitionID,
        headers: {
            'Authorization': process.env.apikey,
            'Content-Type': 'application/json'
        },
        json: true
    };
    return axios(axiosOptions);
}


exports.DarDeAlta = DarDeAlta;
exports.ListaAltas = ListaAltas;