const Filtro = require('../utils/Filter');
const ApiConsumer = require('../utils/ApiConsumer');

function List(res, postVarsArray) {

    var apiPromise = ApiConsumer.ListaAltas();
    apiPromise.then(data => {
        res.render('AdminView', { Titulo: 'Servicio Identidad Soberana - Listado', data: data.data });
    }).catch(err => {
        error = "Se ha producido un error al registrar al usuario";
        res.render('AdminView', { Titulo: 'Servicio Identidad Soberana - Listado', data: null });

    });
}

exports.List = List;