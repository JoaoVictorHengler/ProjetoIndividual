var scoreModel = require('../models/scoreModel');
var sha512 = require('js-sha512');
/* Fazendo... */

function listarScores(request, response) {
  var idMapa = request.params.idMapaServer;
  var nomeDificuldade = request.params.nomeDificuldadeServer;

  if (idMapa == undefined) {
    response.status(400).send("Id do Mapa está undefined!");
  } else if (nomeDificuldade == undefined) {
    response.status(400).send("Nome da Dificuldade está undefined!");
  } else {
    scoreModel.listarScores(idMapa, nomeDificuldade).then((resp) => {
      if (resp.length == 0) {
        response.status(403).send("Não foi possível encontrar um score com esse id.");
      } else {
        response.json(resp);
      }
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao listar os scores! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })

  }
}

module.exports = {
  listarScores
}