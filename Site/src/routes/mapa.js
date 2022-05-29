var express = require("express");
var router = express.Router();

var mapaController = require('../controllers/mapaController');

router.get("/obterInformacoes/:idMapaServer", function (req, res) {
    mapaController.obterInformacoes(req, res);
});

router.get("/listarMapas", function (req, res) {
    mapaController.listarMapas(req, res);
});
/* 
    Fazer:
        Pegar informações
        Listar mapas passados de x pessoas
        Listar todos os mapas

*/

module.exports = router;

