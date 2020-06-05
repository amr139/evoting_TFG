const Filtro = require('../utils/Filter');
const ApiConsumer = require('../utils/ApiConsumer');
const io = require("socket.io-client");
const JWT = require("../utils/Auth");

function Webhook(post) {
    //Comprueba si es verification y contiene id
    if (Filtro.FiltrarWebhook(post)) { 
        //Llamamos a la API y pedimos los datos asociados a esta verificacion
        ApiConsumer.DameDatosVerification(post.object_id).then(data => { 
            //Comprobamos si presenta la estructura que deseamos (3 indices: Nombre, DNI y Ciudad)
            var obj = Filtro.FiltrarEstructuraVerification(data.data);
            if (Object.keys(obj).length == 3) {
                //Enviamos al websocket en la sala object_id el jwt del usuario logeado (incluye sub: object_id y dni:dni)
                ioClient = io.connect("http://localhost:3001");
                ioClient.emit("webhook", {room: post.object_id, data: JWT.CreateToken({vid:post.object_id,dni:obj.DNI,city:obj.Ciudad})});
            }
        });
    }
}

exports.Webhook = Webhook;