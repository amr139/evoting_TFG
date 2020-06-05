const { Router } = require("express");
const HomeController = require("./controller/HomeController");
const AltaController = require("./controller/AltaController");
const AdminController = require("./controller/AdminController");

var router = Router();

router.get('', (req, res) => { console.log(new Date().toLocaleTimeString() + " - " + req.ip);HomeController.Index(res) });

router.get('/alta', (req, res) => {
    AltaController.Index(res)
});

router.post('/alta', (req, res) => {
    AltaController.Alta(res, req.body)
});

router.get('/admin', (req, res) => {
    AdminController.List(res, req.body)
});

module.exports = router;