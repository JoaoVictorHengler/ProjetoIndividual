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
      obterQtdScores(response, resp, idMapa, nomeDificuldade);
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao listar os scores! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })

  }
}


function obterQtdScores(response, respBdScores, idMapa, nomeDificuldade) {
  scoreModel.verificarNumPaginas(idMapa, nomeDificuldade).then(async (respNumPaginas) => {
    if (respNumPaginas.length == 0) {
    response.status(403).send("Não foi possível obter a quantidade de scores.");
  } else {
    let qtdScores = respNumPaginas[0].qtdscores
    
    let pagina = 0;
    while (true) {
      if (qtdScores >= 20) {

        qtdScores -= 20;
      }
      pagina++;
      if (qtdScores < 20) {
        break;
      }
    }
    let finalResp = {
      'qtdPaginas': pagina,
      'scores': respBdScores
    };
    response.json(finalResp);

  }
}).catch(function (erro) {
  console.log(erro);
  console.log("\nHouve um erro ao listar os scores! Erro: ", erro.sqlMessage);
  response.status(500).json(erro.sqlMessage);
})
}

module.exports = {
  listarScores
}