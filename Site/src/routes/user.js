var express = require("express");
var router = express.Router();

var userController = require('../controllers/userController');

router.post("/cadastrar", function (req, res) {
    userController.cadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
    userController.autenticar(req, res);
});

router.get("/listarUsuariosGlobal", function (req, res) {
    userController.listarUsuariosGlobal(req, res);
});

router.get("/editarPerfil", function (req, res) {
    userController.editarPerfil(req, res);
});

/* 
    Fazer:
        Cadastro Testar
        Login Testar
        Pegar informações
        Setar Informações
        Criar Dash com últimos ranks?
        Listar por melhor posição

*/

module.exports = router;