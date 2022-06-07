var express = require("express");
var router = express.Router();

var scoreController = require('../controllers/scoreController');

router.get("/listarScores/:idMapaServer&:nomeDificuldadeServer&:paginaServer", function (req, res) {
    scoreController.listarScores(req, res);
});

router.get("/listarScoresJogador/:idJogadorServer&:typeServer&:paginaServer", function (req, res) {
    scoreController.listarScoresJogador(req, res);
});


/* 
    Fazer:
        Pegar informações
        Scores de X player

*/

module.exports = router;