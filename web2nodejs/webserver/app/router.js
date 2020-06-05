const { Router } = require("express");
const HomeController = require("./controller/HomeController");
const LoginController = require("./controller/LoginController");
const EndpointController = require("./controller/EndpointController");
const AppController = require("./controller/AppController");

var router = Router();

router.get('', (req, res) => {
    //console.log(new Date().toLocaleTimeString() + " - " + req.ip);
    HomeController.Index(res);
});

router.get('/login', (req, res) => {
    LoginController.Index(res);
});

router.post('/endpoint', (req, res) => {
    EndpointController.Webhook(req.body);
});

router.get('/resultados', (req, res) => {
    AppController.Resultados(res);
});

router.get('/app/:id', (req, res) => {
    AppController.Index(res, req.params.id);
});

router.post('/app/:id', (req, res) => {
    AppController.Procesar(res, req.params.id, req.body);
});

module.exports = router;

// post {"data":{"ConnectionId":null},"message_type":"credential_request","object_id":"cbf55b0c-ad54-4c07-b5cb-809522fdef74"}
// post {"data":{"ConnectionId":null},"message_type":"verification","object_id":"fe101350-5751-4764-b2f3-7f49ed718778"}