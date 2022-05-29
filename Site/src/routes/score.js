var express = require("express");
var router = express.Router();

var scoreController = require('../controllers/scoreController');

router.get("/listarScores", function (req, res) {
    scoreController.listarScores(req, res);
});



/* 
    Fazer:
        Pegar informações
        Scores de X player

*/

module.exports = router;