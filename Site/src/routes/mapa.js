var express = require("express");
var router = express.Router();

var mapaController = require('../controllers/mapaController');

router.get("/obterInformacoes/:idMapaServer", function (req, res) {
    mapaController.obterInformacoes(req, res);
});

router.get("/listarMapas/:paginaServer", function (req, res) {
    mapaController.listarMapas(req, res);
});

router.get("/getImage/:imgHashServer", function (req, res) {
    mapaController.obterImagem(req, res);
});

router.get("/procurar/:nomeMapaServer&:paginaServer", function (req, res) {
    mapaController.procurar(req, res);
});

module.exports = router;

