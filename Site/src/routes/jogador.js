var express = require("express");
var router = express.Router();

var jogadorController = require('../controllers/jogadorController');

/* router.get("/obterInformacoes/:idMapaServer", function (req, res) {
    mapaController.obterInformacoes(req, res);
});

router.get("/listarMapas/:paginaServer", function (req, res) {
    mapaController.listarMapas(req, res);
});
 */
router.get("/countryFlag/", function (req, res) {
    jogadorController.obterPaises(req, res);
});


module.exports = router;

