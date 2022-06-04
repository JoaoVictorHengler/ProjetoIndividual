var mapaModel = require('../models/mapaModel');
var dificuldadeModel = require('../models/dificuldadeModel');
var sha512 = require('js-sha512');
var path = require('Path');

function obterInformacoes(request, response) {
  var idMapa = request.params.idMapaServer;

  if (idMapa == undefined) {
    response.status(400).send("Id do mapa está undefined!");
  } else {
    mapaModel.obterInformacoes(idMapa).then(async (resp) => {
      if (resp.length == 0) {
        response.status(403).send("Não foi possível encontrar um mapa com esse id.");
      } else {
        for (let i = 0; i < resp.length; i++) {
          let diffsMapa = await dificuldadeModel.obterTodasDiffs(resp[i].idMapa);
          resp[i].dificuldades = diffsMapa;
        }
        response.json(resp);
      }
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao obter as informações do mapa! Erro: ", erro.sqlMessage);
      response.status(500).json(erro.sqlMessage);
    })

  }
}

function listarMapas(request, response) {
  let pagina = request.params.paginaServer;
  mapaModel.listarMapas((pagina * 8) - 8).then(async (respBdMapas) => {
    if (respBdMapas.length == 0) {
      response.status(403).send("Não foi possível listar os mapas.");
    } else {
      for (let i = 0; i < respBdMapas.length; i++) {
        let diffsMapa = await dificuldadeModel.obterTodasDiffs(respBdMapas[i].idMapa)
        respBdMapas[i].dificuldades = diffsMapa;
      }
      obterQtdPaginas(response, respBdMapas);
    }
  }).catch(function (erro) {
    console.log(erro);
    console.log("\nHouve um erro ao listar os mapas! Erro: ", erro.sqlMessage);
    response.status(500).json(erro.sqlMessage);
  })
}

function obterQtdPaginas(response, respBdMapas) {
  mapaModel.verificarNumPaginas().then(async (respNumPaginas) => {
    if (respNumPaginas.length == 0) {
      response.status(403).send("Não foi possível listar os mapas.");
    } else {
      let qtdMapas = respNumPaginas[0].qtdmapas

      let pagina = 0;
      while (true) {
        pagina++;
        if (qtdMapas >= 8) {
          qtdMapas -= 8;
        }
        if (qtdMapas < 8) {
          break;
        }
      }
      response.json({
        'qtdPaginas': pagina,
        'mapas': respBdMapas
      });

    }
  }).catch(function (erro) {
    console.log(erro);
    console.log("\nHouve um erro ao listar os mapas! Erro: ", erro.sqlMessage);
    response.status(500).json(erro.sqlMessage);
  })
}

function obterImagem(request, response) {
  let fileHash = request.params.imgHashServer;
  if (fileHash == undefined) {
    response.status(403).send("Não foi possível obter a imagem.");
  } else {
    let fileLocation = path.join(__dirname, `../../public/assets/img/mapImg/${fileHash}.jpg`);
    response.sendFile(fileLocation);
  }
}

module.exports = {
  obterInformacoes,
  listarMapas,
  obterImagem
}