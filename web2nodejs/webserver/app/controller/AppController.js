const HLConsumer = require('../utils/HLConsumer');
const JWT = require("../utils/Auth");
const Filter = require("../utils/Filter");
const path = require('path');
const fs = require('fs');
var moment = require('moment')

async function Index(res, id) {
    //Compruebo si el JWT es valido
    const sesion = JWT.CheckToken(id);
    if (sesion != null && sesion.resultado) {
        //si es valido obtengo el payload asociado
        const payload = sesion.data;
        //Utilizo la APP Fabric para comprobar si el usuario ya ha votado (dni en el ledger)
        const respuesta = await HLConsumer.ComprobarSiHaVotado(payload.dni);
        //Si hay respuesta
        if (respuesta != null) {
            if (respuesta.result === false) {
                //Si el resultado es false quiere decir que no esta en el ledger y que puede votar
                const ruta = path.resolve(__dirname, '..', '..', 'public', 'data', 'partidospoliticos.json');
                const json = JSON.parse(fs.readFileSync(ruta, 'utf8'));
                res.render('AppVotar', { Titulo: 'Inicio', party: json });
            } else {
                //Si el resultado es true quiere decir que ya ha votado
                const mensaje = "Tu voto fue contabilizado el dia " + moment.unix(respuesta.data).format('DD-MM-YYYY HH:mm:ss');
                res.render('AppView', { Titulo: 'Inicio', mode: "info", Message: mensaje });
            }
        } else {
            //no hay respuesta
            res.render('AppView', { Titulo: 'Inicio', mode: "danger", Message: "Se ha producido un error" });
        }
    } else {
        //sesion no valida
        res.render('AppView', { Titulo: 'Inicio', mode: "danger", Message: "La sesion ha expirado" });
    }
}

async function Procesar(res, id, post) {
    if (post && post.valor != null) {
        //Compruebo si el JWT es valido
        const sesion = JWT.CheckToken(id);
        if (sesion != null && sesion.resultado) {
            //si es valido obtengo el payload asociado
            const payload = sesion.data;

            //compruebo que los datos sean compatibles
            if (Filter.FiltrarDistritos(payload.city)) {
                if (Filter.FiltrarOpciones(post.valor)) {
                    //Si los datos son compatibles, realizo la peticion con la APP Fabric
                    const respuesta = await HLConsumer.IncluirVoto(payload.dni, post.valor, payload.city);
                    //si obtengo respuesta
                    if (respuesta != null) {
                        //Si el resultado es positivo, el voto ha sido registrado correctamente
                        if (respuesta.result === true) {
                            const mensaje = "Tu voto ha sido contabilizado correctamente. Fecha: " + moment.unix(respuesta.data).format('DD-MM-YYYY HH:mm:ss');
                            res.render('AppView', { Titulo: 'Inicio', mode: "success", Message: mensaje });
                        } else {
                            //Si el resultado es negativo es que se ha producido un error
                            res.render('AppView', { Titulo: 'Inicio', mode: "danger", Message: respuesta.data });
                        }
                    } else {
                        //Si no hay respuesta
                        res.render('AppView', { Titulo: 'Inicio', mode: "danger", Message: "Se ha producido un error" });
                    }

                } else {
                    //Si la opcion no es valida
                    res.render('AppVotar', { Titulo: 'Inicio', mode: "danger", Message: "La opcion seleccionada no esta permitida" });
                }
            } else {
                //si el distrito no es valido
                res.render('AppView', { Titulo: 'Inicio', mode: "danger", Message: "No estas autorizado para votar. Distrito no compatible" });
            }
        } else {
            //la sesion ha caducado
            res.render('AppView', { Titulo: 'Inicio', mode: "danger", Message: "La sesion ha expirado" });
        }
    } else {
        res.render('AppView', { Titulo: 'Inicio', mode: "danger", Message: "La sesion ha expirado" });
    }

}

async function Resultados(res) {

    //Obtengo el json con los nombres y los colores de los partidos politicos
    const ruta = path.resolve(__dirname, '..', '..', 'public', 'data', 'partidospoliticos.json');
    const parties = fs.readFileSync(ruta, 'utf8');
    //realizo la peticion de obtener los datos del ledger 
    const respuesta = await HLConsumer.ObtenerResultados()
    if (respuesta != null) {
        //Ordeno los resultados por numero de votos
        const jsonOrdenado = Filter.OrdenarResultados(respuesta.data);
        //devuelvo toda la informacion para poder pintar los resultados
        res.render('ResultsView', { Titulo: 'Inicio', data: jsonOrdenado, design: parties });
    } else {
        res.render('AppView', { Titulo: 'Inicio', mode: "danger", Message: "Se ha producido un error" });

    }


}

module.exports = { Index, Procesar, Resultados };