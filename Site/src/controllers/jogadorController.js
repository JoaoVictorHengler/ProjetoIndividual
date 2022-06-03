var mapaModel = require('../models/mapaModel');
var jogadorModel = require('../models/jogadorModel');
var sha512 = require('js-sha512');
var path = require('Path');

function obterPaises(request, response) {
  let fileLocation = path.join(__dirname, `../../public/assets/country_flags.json`);
  response.sendFile(fileLocation);
}

function listarRankingGlobal(request, response) {

  jogadorModel.listarRankingGlobal().then(async (resp) => {
    if (resp.length == 0) {
      response.status(403).send("Não foi possível listar os jogadores.");
    } else {
      response.json(resp)
    }
  }).catch(function (erro) {
    console.log(erro);
    console.log("\nHouve um erro ao listar os jogadores! Erro: ", erro.sqlMessage);
    response.status(500).json(erro.sqlMessage);
  })
}

function listarRankingNacional(request, response) {
  let paisEscolhido = request.params.paisServer;
  if (paisEscolhido == undefined) {
    response.status(403).send("Pais não foi passado.");
  } else {
    jogadorModel.listarRankingNacional(paisEscolhido).then(async (resp) => {
      if (resp.length == 0) {
        response.status(403).send("Não foi possível listar os jogadores.");
      } else {
        response.json(resp)
      }
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao listar os jogadores! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })
  }

}

function listarPaisesCadastrados() {

  jogadorModel.listarPaisesCadastrados(paisEscolhido).then(async (resp) => {
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
module.exports = {
  obterPaises,
  listarRankingGlobal,
  listarRankingNacional,
  listarPaisesCadastrados
}