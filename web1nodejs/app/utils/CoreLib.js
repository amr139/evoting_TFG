function DeArrayAEstructura(array){
    var contenedor = "";
    array.forEach(element => {
        contenedor+= '<li>'+element+'</li>';
    });
    return contenedor;
}

exports.DeArrayAEstructura = DeArrayAEstructura;