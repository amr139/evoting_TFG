const CoreLib = require("./CoreLib");

function FiltrarEnvioPost(entrada) {
    var limitado = [null, undefined, ""];
    var mensajes = []

    if (limitado.includes(entrada.nombre) || limitado.includes(entrada.dni) || limitado.includes(entrada.ciudad)) {
        mensajes.push("Los datos de entrada no son válidos");
    }

    var regExDNI = "^[0-9]{8,8}[A-Za-z]$";
    if (!entrada.dni.match(regExDNI)) {
        mensajes.push("El DNI introducido no es válido");
    }

    return CoreLib.DeArrayAEstructura(mensajes);
}

exports.FiltrarEnvioPost = FiltrarEnvioPost;