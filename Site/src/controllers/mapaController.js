var mapaModel = require('../models/mapaModel');
var sha512 = require('js-sha512');
/* Fazendo... */
function obterInformacoes(request, response) {
  var idMapa = request.body.idMapaServer;

  if (idMapa == undefined) {
    response.status(400).send("Id do mapa está undefined!");
  } else {
    mapaModel.obterInformacoes(idMapa).then((resp) => {
      if (resp.length == 0) {
        response.status(403).send("Não foi possível encontrar um mapa com esse id.");
      } else {
        response.json(resp);
      }
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })

  }
}

function listarMapas(request, response) {
    mapaModel.listarMapas().then((resp) => {
      if (resp.length == 0) {
        response.status(403).send("Não foi possível listar os mapas.");
      } else {
        response.json(resp);
      }
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })
}

module.exports = {
  obterInformacoes,
  listarMapas
}