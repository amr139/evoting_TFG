
const ApiConsumer = require('../utils/ApiConsumer');

function Index(res) {

    ApiConsumer.CrearVerification().then(data => {
        var id = data.data.verificationId;
        var url = data.data.verificationRequestUrl;
        res.render('LoginOKView', { Titulo: 'Login', id: id, url: url });
    }).catch(err => {
        error = "Se ha producido un error al registrar al usuario";
        res.render('LoginDEADView', { Titulo: 'Login', Error: error, Data: postVarsArray });

    });
}

exports.Index = Index;