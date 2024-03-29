var express = require("express");
var router = express.Router();

var jogadorController = require('../controllers/jogadorController');

/* router.get("/obterInformacoes/:idMapaServer", function (req, res) {
    mapaController.obterInformacoes(req, res);
});
 */
router.get("/listarRankingGlobal/:paginaServer", function (req, res) {
    jogadorController.listarRankingGlobal(req, res);
});

router.get("/listarRankingNacional/:paisServer&:paginaServer", function (req, res) {
    jogadorController.listarRankingNacional(req, res);
});

router.get("/countryFlag/", function (req, res) {
    jogadorController.obterPaises(req, res);
});

router.get("/listarPaisesCadastrados/", function (req, res) {
    jogadorController.listarPaisesCadastrados(req, res);
});

router.get("/getImage/:idJogadorServer", function (req, res) {
    jogadorController.obterImagem(req, res);
});

router.get("/obterInfo/:idJogadorServer", function (req, res) {
    jogadorController.obterInfo(req, res);
});

router.get("/verificarEdicao/:idJogadorServer&:tokenJogadorServer", function (req, res) {
    jogadorController.verificarEdicao(req, res);
});

router.get("/obterDescricao/:idJogadorServer", function (req, res) {
    jogadorController.obterDescricao(req, res);
});

router.post("/setarDescricao", function (req, res) {
    jogadorController.setarDescricao(req, res);
});

router.post("/editarImagem", function (req, res) {
    jogadorController.editarImagemPerfil(req, res);
});

router.get("/procurar/:nomeJogadorServer&:paginaServer", function (req, res) {
    jogadorController.procurar(req, res);
});

router.get("/favoritarMapa/:idJogadorServer&:idMapaServer&:tipoServer", function (req, res) {
    jogadorController.favoritarMapa(req, res);
});

router.get("/editarNick/:idJogadorServer&:nickJogadorServer", function (req, res) {
    jogadorController.editarNick(req, res);
});

module.exports = router;

