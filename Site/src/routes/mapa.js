var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.render("index", { title: "Express" });
});

/* 
    Fazer:
        Pegar informações
        Listar mapas passados de x pessoas
        Listar todos os mapas

*/

module.exports = router;