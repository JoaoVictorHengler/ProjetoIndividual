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
    scoreModel.listarScoresMapa(idMapa, nomeDificuldade).then(async (result) => {
      let qtdPaginas = await obterQtdScores(idMapa, nomeDificuldade);
      response.json({
        'qtdPaginas': qtdPaginas,
        'scores': result
      });
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao listar os scores! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })

  }
}

async function obterQtdScores(idMapa, nomeDificuldade) {
  try {
    let respNumPaginas = await scoreModel.verificarNumPaginas(idMapa, nomeDificuldade);
    if (respNumPaginas.length == 0) {
      response.status(403).send("Não foi possível obter a quantidade de scores.");
    } else {
      let qtdScores = respNumPaginas[0].qtdscores

      let qtdPaginas = 0;
      while (true) {
        if (qtdScores >= 20) {

          qtdScores -= 20;
        }
        qtdPaginas++;
        if (qtdScores < 20) {
          break;
        }
      }
      return qtdPaginas
    }
  } catch (err) {

    console.log(err);
    console.log("\nHouve um erro ao listar os scores! Erro: ", err.sqlMessage);
    response.status(500).json(err.sqlMessage);
  }
}

module.exports = {
  listarScores
}