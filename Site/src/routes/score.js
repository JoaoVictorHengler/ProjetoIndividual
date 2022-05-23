var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.render("index", { title: "Express" });
});

/* 
    Fazer:
        Pegar informações
        Scores de X player

*/

module.exports = router;