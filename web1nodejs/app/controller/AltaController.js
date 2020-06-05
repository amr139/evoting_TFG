const Filtro = require('../utils/Filter');
const ApiConsumer = require('../utils/ApiConsumer');

function Index(res) {
    res.render('AltaFormView', { Titulo: 'Servicio Identidad Soberana - Alta', Error: "", Data: [] });
}

function Alta(res, postVarsArray) {
    var error = Filtro.FiltrarEnvioPost(postVarsArray);
    if(error=="") {
        var apiPromise = ApiConsumer.DarDeAltaFake(postVarsArray);
        apiPromise.then(data => {
            res.render('AltaExitoView', { Titulo: 'Servicio Identidad Soberana - Alta', QRURL: data.data.offerUrl});
        }).catch(err => {
            error = "Se ha producido un error al registrar al usuario";
            res.render('AltaFormView', { Titulo: 'Servicio Identidad Soberana - Alta', Error: error, Data: postVarsArray});
            
        });
    }else {
        res.render('AltaFormView', { Titulo: 'Servicio Identidad Soberana - Alta', Error: error, Data:postVarsArray});
    }
}

exports.Index = Index;
exports.Alta = Alta;