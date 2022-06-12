var scoreModel = require('../models/scoreModel');
var sha512 = require('js-sha512');
/* Fazendo... */

function listarScores(request, response) {
  var idMapa = request.params.idMapaServer;
  var nomeDificuldade = request.params.nomeDificuldadeServer;
  var pagina = request.params.paginaServer;

  if (idMapa == undefined) {
    response.status(400).send("Id do Mapa está undefined!");
  } else if (nomeDificuldade == undefined) {
    response.status(400).send("Nome da Dificuldade está undefined!");
  } else if (pagina == undefined) {
    response.status(400).send("A Página está undefined!");
  } else {
    scoreModel.listarScoresMapa(idMapa, nomeDificuldade, (pagina * 20) - 20).then(async (result) => {
      let qtdPaginas = await obterQtdPaginas(idMapa, nomeDificuldade);
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

async function obterQtdPaginas(idMapa, nomeDificuldade) {
  try {
    let respNumPaginas = await scoreModel.verificarNumPaginas(idMapa, nomeDificuldade);
    if (respNumPaginas.length == 0) {
      response.status(403).send("Não foi possível obter a quantidade de scores.");
    } else {
      let qtdScores = respNumPaginas[0].qtdscores

      let qtdPaginas = 0;
      while (true) {
        if (qtdScores <= 0) {
          break;
        }

        qtdPaginas++;
        qtdScores -= 20;
      }
      return qtdPaginas
    }
  } catch (err) {

    console.log(err);
    console.log("\nHouve um erro ao listar os scores! Erro: ", err.sqlMessage);
    response.status(500).json(err.sqlMessage);
  }
}

function listarScoresJogador(request, response) {
  let idJogador = request.params.idJogadorServer;
  let pagina = request.params.paginaServer;
  let type = request.params.typeServer;

  if (type == undefined) type = 'recent';
  if (pagina == undefined) pagina = 1;
  if (idJogador == undefined) {
    response.status(400).send("Id do Jogador está undefined!");
  } else {
    scoreModel.listarScoresJogador(idJogador, (pagina * 6) - 6, type).then(async (result) => {
      let qtdPaginas = await obterQtdPaginasJogador(idJogador);
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

async function obterQtdPaginasJogador(idJogador) {
  try {
    let respNumPaginas = await scoreModel.verificarNumPaginasJogador(idJogador);
    if (respNumPaginas.length == 0) {
      response.status(403).send("Não foi possível obter a quantidade de scores.");
    } else {
      let qtdScores = respNumPaginas[0].qtdscores

      let qtdPaginas = 0;
      while (true) {
        if (qtdScores <= 0) {
          break;
        }

        qtdPaginas++;
        qtdScores -= 6;
      }
      return qtdPaginas
    }
  } catch (err) {

    console.log(err);
    console.log("\nHouve um erro ao listar os scores! Erro: ", err.sqlMessage);
    response.status(500).json(err.sqlMessage);
  }
}

async function obterQtdPaginasFavoritoJogador(idJogador) {
  try {
    let respNumPaginas = await scoreModel.verificarNumPaginasFavoritoJogador(idJogador);
    if (respNumPaginas.length == 0) {
      response.status(403).send("Não foi possível obter a quantidade de scores.");
    } else {
      let qtdScores = respNumPaginas[0].qtdscores

      let qtdPaginas = 0;
      while (true) {
        if (qtdScores <= 0) {
          break;
        }

        qtdPaginas++;
        qtdScores -= 6;
      }
      return qtdPaginas
    }
  } catch (err) {

    console.log(err);
    console.log("\nHouve um erro ao listar os scores! Erro: ", err.sqlMessage);
    response.status(500).json(err.sqlMessage);
  }
}

function listarScoresFavoritosJogador(request, response) {
  let idJogador = request.params.idJogadorServer;
  let pagina = request.params.paginaServer;

  if (pagina == undefined) pagina = 1;
  if (idJogador == undefined) {
    response.status(400).send("Id do Jogador está undefined!");
  } else {
    scoreModel.listarScoresFavoritosJogador(idJogador, (pagina * 6) - 6).then(async (result) => {
      let qtdPaginas = await obterQtdPaginasFavoritoJogador(idJogador);
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

module.exports = {
  listarScores,
  listarScoresJogador,
  listarScoresFavoritosJogador
}