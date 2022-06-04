var mapaModel = require('../models/mapaModel');
var jogadorModel = require('../models/jogadorModel');
var sha512 = require('js-sha512');
var path = require('Path');

function obterPaises(request, response) {
  let fileLocation = path.join(__dirname, `../../public/assets/country_flags.json`);
  response.sendFile(fileLocation);
}

function listarRankingGlobal(request, response) {
  let pagina = request.params.paginaServer;

  jogadorModel.listarRankingGlobal((pagina * 8) - 8).then(async (resp) => {
    if (resp.length == 0) {
      response.status(403).send("Não foi possível listar os jogadores.");
    } else {
      obterQtdPaginas(response, resp);
    }
  }).catch(function (erro) {
    console.log(erro);
    console.log("\nHouve um erro ao listar os jogadores! Erro: ", erro.sqlMessage);
    response.status(500).json(erro.sqlMessage);
  })
}



function listarRankingNacional(request, response) {
  let paisEscolhido = request.params.paisServer;
  let pagina = request.params.paginaServer;

  if (paisEscolhido == undefined) {
    response.status(403).send("Pais não foi passado.");
  } else {
    jogadorModel.listarRankingNacional(paisEscolhido, (pagina * 8) - 8).then(async (resp) => {
      if (resp.length == 0) {
        response.status(403).send("Não foi possível listar os jogadores.");
      } else {
        obterQtdPaginas(response, resp);
      }
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao listar os jogadores! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })
  }

}

function obterQtdPaginas(response, respJogadores) {
  jogadorModel.verificarNumPaginas().then(async (resp) => {
    if (resp.length == 0) {
      response.status(403).send("Não foi possível listar os mapas.");
    } else {
      let qtdJogadores = resp[0].qtdJogadores

      let pagina = 0;
      while (true) {
        pagina++;
        if (qtdJogadores >= 8) {
          qtdJogadores -= 8;
        }
        if (qtdJogadores < 8) {
          break;
        }
      }
      response.json({
        'qtdPaginas': pagina,
        'jogadores': respJogadores
      });

    }
  }).catch(function (erro) {
    console.log(erro);
    console.log("\nHouve um erro ao listar os mapas! Erro: ", erro.sqlMessage);
    response.status(500).json(erro.sqlMessage);
  })
}

function listarPaisesCadastrados(request, response) {

  jogadorModel.listarPaisesCadastrados().then(async (resp) => {
    if (resp.length == 0) {
      response.status(403).send("Não foi possível listar os paises.");
    } else {
      response.json(resp)
    }
  }).catch(function (erro) {
    console.log(erro);
    console.log("\nHouve um erro ao listar os paises! Erro: ", erro.sqlMessage);
    response.status(500).json(erro.sqlMessage);
  })

}

function obterImagem(request, response) {
  let idJogador = request.params.idJogadorServer;
  if (idJogador == undefined) {
    response.status(403).send("Não foi possível obter a imagem.");
  } else {
    let fileLocation = path.join(__dirname, `../../public/assets/img/playerImg/${idJogador}.jpg`);
    response.sendFile(fileLocation);
  }
}

module.exports = {
  obterPaises,
  listarRankingGlobal,
  listarRankingNacional,
  listarPaisesCadastrados,
  obterImagem
}