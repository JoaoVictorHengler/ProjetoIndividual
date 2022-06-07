var mapaModel = require('../models/mapaModel');
var dificuldadeModel = require('../models/dificuldadeModel');
var sha512 = require('js-sha512');
var path = require('Path');

function obterInformacoes(request, response) {
  var idMapa = request.params.idMapaServer;

  if (idMapa == undefined) {
    response.status(400).send("Id do mapa está undefined!");
  } else {
    mapaModel.obterInformacoes(idMapa).then(async (result) => {
      if (result.length == 0) {
        response.status(403).send("Não foi possível encontrar um mapa com esse id.");
      } else {
        for (let i = 0; i < result.length; i++) {
          let diffsMapa = await dificuldadeModel.obterTodasDiffs(result[i].idMapa);
          result[i].dificuldades = diffsMapa;
        }
        response.json(result);
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
  mapaModel.listarMapas((pagina * 8) - 8).then(async (result) => {
    if (result.length == 0) {
      response.status(403).send("Não foi possível listar os mapas.");
    } else {
      for (let i = 0; i < result.length; i++) {
        let diffsMapa = await dificuldadeModel.obterTodasDiffs(result[i].idMapa)
        result[i].dificuldades = diffsMapa;
      }
      let qtdPaginas = await obterQtdPaginas(response, result);
      response.json({
        'qtdPaginas': qtdPaginas,
        'mapas': result
      });
    }
  }).catch(function (erro) {
    console.log(erro);
    console.log("\nHouve um erro ao listar os mapas! Erro: ", erro.sqlMessage);
    response.status(500).json(erro.sqlMessage);
  })
}

async function obterQtdPaginas(response) {
  try {
    let result = await mapaModel.verificarNumPaginas();
    if (result.length == 0) {
      response.status(403).send("Não foi possível listar os mapas.");
    } else {
      let qtdMapas = result[0].qtdmapas

      let qtdPagina = 0;
      while (true) {
        if (qtdMapas <= 0) {
          break;
        }

        qtdPagina++;
        qtdMapas -= 20;
      }
      return qtdPagina;
      

    }
  } catch (err) {
    console.log(err);
    console.log("\nHouve um erro ao listar os mapas! Erro: ", err.sqlMessage);
    response.status(500).json(err.sqlMessage);
  }

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