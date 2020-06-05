const path = require('path');
const fs = require('fs');

function FiltrarWebhook(post) {
    return (post != null && post.message_type == "verification" && post.object_id != null);
}

function FiltrarEstructuraVerification(data) {
    var salida = [];
    if (data != null && data.isValid == true && data.state == "Accepted" && data.verifiedAtUtc != null && data.proof != null) {
        var t1 = new Date(data.verifiedAtUtc + "+00:00");
        var t2 = new Date();
        //Comprobamos si han pasado menos de 3 minutos de la validacion (en milisegundos)
        if (t2 - t1 < 3 * 60 * 1000) {
            for (key in data.proof) {
                if (data.proof[key] != null && data.proof[key].name != null && data.proof[key].value != null) {
                    salida[data.proof[key].name] = data.proof[key].value;
                }
            }
        }
    }
    return salida;
}

function FiltrarDistritos(distrito) {
    //Indicamos la cinrcunscripcion permitida
    const ruta = path.resolve(__dirname, '..', '..', 'public', 'data', 'distritos.json');
    const json = JSON.parse(fs.readFileSync(ruta, 'utf8'));
    return Object.values(json).includes(distrito);
}

function FiltrarOpciones(opcion) {
    const ruta = path.resolve(__dirname, '..', '..', 'public', 'data', 'partidospoliticos.json');
    const json = JSON.parse(fs.readFileSync(ruta, 'utf8'));
    return Object.keys(json).includes(opcion);
}

function OrdenarResultados(json) {
    json.forEach(d => {
        d = d.opciones.sort(function (a, b) {
            return +a.contador < +b.contador ? 1 : -1;
        });
    })
    return JSON.stringify(json);
}

module.exports = { FiltrarWebhook, FiltrarEstructuraVerification, FiltrarDistritos, FiltrarOpciones, OrdenarResultados }